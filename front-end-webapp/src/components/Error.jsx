import { Typography } from "@mui/material";

const Error = ({error}) => {
    return (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
          <Typography color="error" variant="h6" align="center">
            {error || "Aucune donnée disponible"}
          </Typography>
        </div>
      );

};

export default Error;