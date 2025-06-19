import axios from "axios";

export const userRegister = (data) => {
  return async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/josn",
      },
    };
    try {
        console.log("DATA: ", data);
      const response = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/auth/user-register`,
        data,
        config
      );
      console.log(response.data);
    } catch (error) {
      console.log("Register error:", error.response?.data || error.message)
    }
  };
};
