import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const Sawl = ({message, title}) => {
    Swal.fire({
        title: title,
        text: message,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'rounded-lg',
          title: 'text-xl font-bold',
          content: 'text-base'
        }
      });
};

export default Sawl;