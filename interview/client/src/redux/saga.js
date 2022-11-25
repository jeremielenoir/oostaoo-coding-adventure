import { dataMessage } from "./features/message/messageSlice"
import { put, call } from "redux-saga/effects"
import socketIOClient from 'socket.io-client';
import dico from '../common/dico';
import { addedSocket } from "./features/socket/socketSlice";

const APILocation = process.env.REACT_APP_REST_API_LOCATION;
const { SOCKET_FROMAPI} = dico;

export let socket;
 let dataSocket
// wrapping function for socket.on
export const connect = () => {
  socket = socketIOClient(APILocation);
  return new Promise((resolve) => {
    socket.on(SOCKET_FROMAPI, (data) => {
      dataSocket = data
    resolve(socket);
    });
  });
 };

export function* watchIncrementMessage() {
   // connect to the server
  const socket = yield call(connect);
  
  // Dispatch messages and socket
  yield put(addedSocket(socket))
  yield put(dataMessage(dataSocket))  
}
