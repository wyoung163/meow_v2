const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/scrap", async (req, res, next) => {
    const userid = req.session.user["userid"];
    const post_num = req.body.post_num;

    try {
        const scrap = await pool.query(
            "SELECT * FROM scrap WHERE user_id = ? AND post_num = ?",
            [userid, post_num]
        );
        if (scrap[0][0] == undefined) {
            const data = await pool.query(
                "INSERT INTO scrap(user_id, post_num) VALUES(?,?)",
                [userid, post_num]
            );
        } else {
            const data = await pool.query(
                "DELETE FROM scrap WHERE user_id = ? AND post_num = ?",
                [userid, post_num]
            );
        }
        res.write(`<script>window.location="/OtherBoard/${post_num}"</script>`);
    } catch (err) {
        console.error(err);
    }

});

module.exports = router;