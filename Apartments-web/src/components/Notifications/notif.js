import {Store} from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

export const Notif = (
  title,
  message,
  type
) => {
  Store.addNotification({
    title,
    message,
    type,
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 10000,
      onScreen: true,
    },
  });
};