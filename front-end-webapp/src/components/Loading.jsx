import { CircularProgress } from "@mui/material";

const Loading = () => {
    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl flex justify-center items-center" style={{ minHeight: '300px' }}>
          <CircularProgress />
        </div>
      );

};

export default Loading;