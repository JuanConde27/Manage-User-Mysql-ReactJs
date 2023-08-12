import UsersModel from "../models/UsersModel.js";
import crypto from 'crypto';
import createJwt from '../utils/jwt.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

//register with encrypted password
export const register = async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        // verificar si el usuario ya existe
        const userExists = await UsersModel.findOne({ where: { email: req.body.email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        let photourl = 'http://localhost:3000/static/image/' + req.file.filename;

        const user = await UsersModel.create({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            photo: photourl
        });

        if (!user) {
            return res.status(401).json({ message: 'User not created' });
        }

        //enviar email de bienvenida
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        const mailOptions = {
            from: 'email',
            to: req.body.email,
            subject: 'Welcome to my app',
            text: `Hello, ${req.body.username}\n\n
            This is a confirmation that the account ${req.body.email} has just been created.\n`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            res.status(200).json({ message: 'Email sent successfully' });
        });
        res.status(200).json({ user, message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const register_users = async (req, res) => {
    try {
        //el usuario que crea el usuario solo puede poner el email y el username y se le mandará un email para que el usuario pueda poner su contraseña
        const user = await UsersModel.create({
            username: req.body.username,
            email: req.body.email,
            password: '',
        });

        if (!user) {
            return res.status(401).json({ message: 'User not created' });
        }
        //se le mandará un email para que el usuario pueda poner su contraseña
        const token = crypto.randomBytes(20).toString('hex');
        const resetPasswordToken = token;
        const resetPasswordExpires = Date.now() + 3600000;
        const userUpdate = await UsersModel.update({ resetPasswordToken, resetPasswordExpires }, {
            where: { email: req.body.email }
        });
        if (!userUpdate) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        const mailOptions = {
            from: 'email',
            to: req.body.email,
            subject: 'Link to pu your password',
            text: `You are receiving this because your account ${req.body.email} has been created.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${process.env.URL_FRONTEND}/createuserpass/${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            res.status(200).json({ message: 'Email sent successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const register_users_password = async (req, res) => {
    try {
        const user = await UsersModel.findOne({ where: { resetPasswordToken: req.params.token } });
        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }
        if (user.resetPasswordExpires === null || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }
        
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hash;

        let photourl = 'http://localhost:3000/static/image/' + req.file.filename;
        req.body.photo = photourl;

        const userUpdate = await UsersModel.update({ password: req.body.password, resetPasswordToken: null, resetPasswordExpires: null, photo: req.body.photo }, {
            where: { resetPasswordToken: req.params.token }
        });

        if (!userUpdate) {
            console.log(userUpdate);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        const mailOptions = {
            from: 'email',
            to: user.email,
            subject: 'Your account has been activated',
            text: `Hello, ${user.username}\n\n
            This is a confirmation that the password for your account ${user.email} has been activated.\n`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            res.status(200).json({ message: 'Email sent successfully' });
        });
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

//login con la creación de un token

export const login = async (req, res) => {
    try {
        const user = await UsersModel.findOne({ where: { email: req.body.email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = createJwt(user.id); 
        res.status(200).json({ user, token, message: 'User logged in successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
}

//get all users

export const getAllUsers = async (req, res) => {
    try {
        const users = await UsersModel.findAll();
        if (!users) throw Error('No users found');
        res.status(200).json({ users, message: 'Users found successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//get user by id

export const getUserById = async (req, res) => {
    try {
        const user = await UsersModel.findOne({ where: { id: req.params.id } });
        if (!user) throw Error('User not found');
        res.status(200).json({ user, message: 'User found successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//update user

export const updateUser = async (req, res) => {
    try {
      //si no se sube una foto nueva, se mantiene la foto anterior
      const userPhoto2 = await UsersModel.findOne({
        where: { id: req.params.id },
      });
      const photo2 = userPhoto2.photo;
      if (!req.file) {
        req.body.photo = photo2;
      } else {
        console.log("entra en el else");
        //eliminar foto anterior
        const userPhoto = await UsersModel.findOne({
          where: { id: req.params.id },
        });
        const photo = userPhoto.photo;
        const photoName = photo.split("/")[5];
        const photoPath = path.join(
          import.meta.url.split("/").slice(3, -1).join("/"),
          "../static/image/" + photoName
        );
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
        }

        //subir foto nueva
        req.body.photo = "http://localhost:3000/static/image/" + req.file.filename;
      }

      const user = await UsersModel.update(req.body, {
        where: { id: req.params.id },
      });

      if (!user) {
        res.status(400).json({ message: "User not updated" });
      }

      //si el usuario se actualiza correctamente, se envía un email de confirmación
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      const mailOptions = {
        from: "email",
        to: req.body.email,
        subject: "Your account has been updated",
        text: `Hello, ${req.body.username}\n\n
            This is a confirmation that the details for your account ${req.body.email} has just been changed.\n`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(400).json({ message: "Invalid credentials" });
        }
        res.status(200).json({ message: "Email sent successfully" });
      });
      res.status(200).json({ user, message: "User updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

//delete user

export const deleteUser = async (req, res) => {
    try {
        //si mi id es igual al id del usuario que quiero borrar no me deja borrarlo y me devuelve un error 401
        if (req.user.id == req.params.id) {
            return res.status(401).json({ message: 'You cannot delete your own user' });
        }
        //eliminar foto
        const userPhoto = await UsersModel.findOne({ where: { id: req.params.id } });
        const photo = userPhoto.photo;
        const photoName = photo.split('/')[5];
        const photoPath = path.join(import.meta.url.split('/').slice(3, -1).join('/'), '../static/image/' + photoName);
        if (fs.existsSync(photoPath)) {
            fs.unlinkSync(photoPath);
        }

        const user = await UsersModel.destroy({
            where: { id: req.params.id }
        });
        if (!user) throw Error('User not deleted');
        res.status(200).json({ user, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const user = await UsersModel.findOne({ where: { email: req.body.email } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const token = crypto.randomBytes(20).toString('hex');
        const resetPasswordToken = token;
        const resetPasswordExpires = Date.now() + 3600000;
        const userUpdate = await UsersModel.update({ resetPasswordToken, resetPasswordExpires }, {
            where: { email: req.body.email }
        });
        if (!userUpdate) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        const mailOptions = {
            from: 'email',
            to: req.body.email,
            subject: 'Link to reset password',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${process.env.URL_FRONTEND}/resetpass/${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            res.status(200).json({ message: 'Email sent successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    try {

        const user = await UsersModel.findOne({ where: { resetPasswordToken: req.params.token } });
        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }
        //si el token expira mandar un mensaje de error
        if (user.resetPasswordExpires === null || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
        }

        if (!req.body.password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hash;
        const userUpdate = await UsersModel.update({ password: req.body.password, resetPasswordToken: null, resetPasswordExpires: null }, {
            where: { resetPasswordToken: req.params.token }
        });
        if (!userUpdate) {
            console.log(userUpdate);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        const mailOptions = {
            from: 'email',
            to: user.email,
            subject: 'Your password has been changed',
            text: `Hello, ${user.username}\n\n
            This is a confirmation that the password for your account ${user.email} has just been changed.\n`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            res.status(200).json({ message: 'Email sent successfully' });
        });
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const updatePassword = async (req, res) => {
    const user = await UsersModel.findOne({ where: { id: req.user.id } });
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    if (!req.body.password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const userUpdate = await UsersModel.update({ password: hash }, {
        where: { id: req.user.id }
    });

    if (!userUpdate) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: 'email',
        to: user.email,
        subject: 'Your password has been changed',
        text: `Hello, ${user.username}\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(400).json({ message: 'Error sending email' });
        }
        res.status(200).json({ message: 'Email sent successfully' });
    });

    res.status(200).json({ message: 'Password changed successfully' });
};
