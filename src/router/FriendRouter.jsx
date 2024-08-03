import {Route, Routes} from "react-router-dom";
import AddFriend from "../jsx/main/AddFriend.jsx";
import FriendRoom from "../jsx/main/FriendRoom.jsx";
import VisitorBoard from "../jsx/main/VisitorBoard.jsx";
import FriendList from "../jsx/myPage/FriendList.jsx";
import FriendRequest from "../jsx/myPage/FriendRequest.jsx";

const FriendRouter = () => {

    return (
        <>
            {/* 친구 관련 기능 */}
            {/* /friend */}
            <Routes>
                <Route path="/" element={<FriendList/>}/> {/* 친구관리 */}
                <Route path="/add" element={<AddFriend/>}/> {/* 친구 추가 화면 */}
                <Route path="/friendRoom/:userId" element={<FriendRoom />} />
                <Route path="/visitorBoard/:userId" element={<VisitorBoard/>}/>
                <Route path="/request" element={<FriendRequest/>}/> {/* 친구요청 */}
            </Routes>
        </>
    )
}

export default FriendRouter