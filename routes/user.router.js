import express from 'express';
import User from '../schemas/user.schema.js';

const router = express.Router();

// 회원 작성 API
router.post('/user', async (req, res) => {
    try {
        // 요청 본문에서 회원 정보 추출
        const { name, email, pw } = req.body;

        // 회원 생성
        const newUser = await User.create({
            name: name,
            email: email,
            pw: pw,
        });

        // 생성된 회원 정보 응답
        res.status(201).json({
            message: '회원 작성에 성공했습니다.',
            user: newUser,
        });
    } catch (error) {
        // 오류 발생 시 에러 응답
        console.error('회원 작성 오류:', error);
        res.status(500).json({ error: '회원 작성에 실패했습니다.' });
    }
});

router.get('/user', async (req, res, next) => {
    // 모든 회원 조회
    const users = await User.find({}, { _id: 0, __v: 0 }).sort({ userId: -1 });

    // 회원 전체 조회가 실패할 경우 0점 처리를 위한 로직
    if (users.length === 0) {
        console.error('회원 전체 조회 실패: 회원이 존재하지 않습니다.');
        return res
            .status(500)
            .json({ error: '회원 전체 조회에 실패했습니다.' });
    }

    const formattedUsers = users.map((user) => ({
        userId: user.userId.toString(), // ObjectId를 문자열로 변환하여 반환
        name: user.name,
        email: user.email,
        pw: user.pw,
    }));

    // 회원 전체 조회 응답
    res.status(200).json(formattedUsers);
});

router.get('/user/:userId', async (req, res, next) => {
    const userId = req.params.userId;
    const user = await User.findOne({ userId: userId }, { _id: 0, __v: 0 });

    // 회원이 존재하지 않을 경우 오류 응답
    if (!user) {
        return res.status(404).json({ error: '회원을 찾을 수 없습니다.' });
    }

    res.status(200).json(user);
});

router.delete('/user/:userId', async (req, res) => {
    try {
        // 요청에서 userId 가져오기
        const userId = req.params.userId;

        // userId로 회원 조회
        const user = await User.findOne({ userId: userId });

        // 회원이 존재하지 않을 경우 오류 응답
        if (!user) {
            return res.status(404).json({ error: '회원을 찾을 수 없습니다.' });
        }

        // 회원 삭제
        await user.remove();

        // 삭제 완료 메시지 응답
        res.status(200).json({ message: '회원 삭제에 성공했습니다.' });
    } catch (error) {
        // 오류 발생 시 오류 응답
        console.error('회원 삭제 오류:', error);
        res.status(500).json({ error: '회원 삭제에 실패했습니다.' });
    }
});

export default router;
