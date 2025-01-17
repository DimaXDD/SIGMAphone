import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import QuestionAnswer from "@mui/icons-material/QuestionAnswer";
import Check from "@mui/icons-material/Check";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { fetchChatRooms } from "../../http/chatRoomsApi";
import Pages from "../Pages";
import Table from "react-bootstrap/Table";
import { Button } from "@mui/material";
import { INTO_CHAT_ROUTE } from "../../utils/consts";

const ChatRoomsTable = observer(() => {
  const { chatRoom } = useContext(Context);
  const { finished, setFinished } = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChatRooms(chatRoom.page, chatRoom.limit, finished).then((data) => {
      chatRoom.setChatRooms(data.rows);
      chatRoom.setTotalCount(data.count);
    });
  }, [chatRoom.page, chatRoom.totalCount]);

  const getChatRooms = () => {
    fetchChatRooms(1, chatRoom.limit, finished).then((data) => {
      chatRoom.setChatRooms(data.rows);
      chatRoom.setTotalCount(data.count);
    });
  };

  return (
    <Container>
      <Table striped bordered hover responsive className={" shadow"}>
        <thead className={"bg-light"}>
          <tr>
            <th>Id</th>
            <th>UserId</th>
            <th>Username</th>

            <th>AdminId</th>
            <th>CreatedAt</th>
            <th>UpdatedAt</th>
            <th>ClosedAt</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {chatRoom !== undefined ? (
            chatRoom.chatRooms.map((chatRoom) => (
              <tr
                key={chatRoom.id}
                style={
                  !chatRoom.closedAt
                    ? { backgroundColor: "rgb(250,125,125)" }
                    : { backgroundColor: "rgb(125,250,125)" }
                }
              >
                <td>{chatRoom.id}</td>
                <td>{chatRoom.userId}</td>
                <td>{chatRoom.username}</td>

                <td>
                  {chatRoom.adminId ||
                    (chatRoom.closedAt
                      ? "Закрыт без ответа"
                      : "Ожидает ответа")}
                </td>
                <td>{chatRoom.createdAt}</td>

                <td>{chatRoom.updatedAt}</td>
                <td>
                  {chatRoom.closedAt ? chatRoom.closedAt : "Ожидает ответа"}
                </td>
                <td>
                  {!chatRoom.closedAt ? (
                    <Button
                      variant={"outline-success"}
                      startIcon={<QuestionAnswer />}
                      className="w-100 rounded-100"
                      onClick={() =>
                        navigate(INTO_CHAT_ROUTE + `/${chatRoom.id}`)
                      }
                    >
                      Ответить
                    </Button>
                  ) : (
                    <Box className={"d-flex justify-content-center"}>
                      <Check />
                      <div>Завершено</div>
                    </Box>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr></tr>
          )}
        </tbody>
        <tfoot className={"bg-light"}>
          <tr>
            <td colSpan={8}>
              <Pages
                totalCount={chatRoom.totalCount}
                limit={chatRoom.limit}
                pageO={chatRoom.page}
                updateData={(event, value) => chatRoom.setPage(value)}
              />
            </td>
          </tr>
        </tfoot>
      </Table>
    </Container>
  );
});

export default ChatRoomsTable;
