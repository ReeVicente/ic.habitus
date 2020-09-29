import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Alert react instance
const swal = withReactContent(Swal);

// eslint-disable-next-line import/prefer-default-export
export const Alert = ({
  title,
  type,
  confirmButtonText,
  showConfirmButton,
  timer,
  text,
  cancelButtonText,
}) => {
  switch (type) {
    case "success": {
      return swal.fire({
        icon: "success",
        title: title || "Sucesso",
        text,
        showConfirmButton: showConfirmButton || false,
        timer: timer || 1500,
      });
    }

    case "info": {
      return swal.fire({
        icon: "info",
        title: title || "Aviso",
        text,
        confirmButtonText: confirmButtonText || "Ok",
      });
    }
    case "error": {
      return swal.fire({
        icon: "error",
        title: title || "Erro",
        text,
        showConfirmButton: showConfirmButton || false,
        timer: timer || 1500,
      });
    }

    // Alerta para modais de confirmar ou deletar, ao clicar em confirmar ele retorna uma promise com um value=true. Para se utilizar, deve chamar este alert passando o type="confirm" e .then(result => if (result.value) {função}) para ativar o botão de confirmar.
    case "confirm": {
      return swal.fire({
        title: title || "Você tem certeza?",
        text: text || "Não será possível reverter esta ação.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#666",
        cancelButtonColor: "#dc3545",
        confirmButtonText: confirmButtonText || "Confirmar",
        cancelButtonText: cancelButtonText || "Cancelar",
      });
    }
    default:
      return swal.fire({
        icon: "success",
        title: title || "Sucesso",
        showConfirmButton: showConfirmButton || false,
        timer: timer || 1500,
      });
  }
};
