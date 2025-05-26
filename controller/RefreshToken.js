import jwt from "jsonwebtoken"
import User from "../model/UserModel.js"

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);

        const user = await User.findAll({
            where : {refresh_token: refreshToken}
        });

        if(!user[0]) return res.sendStatus(403);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded)=> {
            if (err) return res.sendStatus(403);

            const userId = user[0].id;
            const username = user[0].username;
            const mail = user[0].email;

            const accessToken = jwt.sign(
                {userId, username, mail}, 
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '30s'}
            );
            return res.json({accessToken});
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}