import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "@/redux/authSlice";
import { USER_API_END_POINT } from "@/utils/constant";

// On app start, re-validate the persisted login with the server: refreshes the stored user
// (profile / saved jobs changed elsewhere) and - via the 401 interceptor in utils/api.js -
// logs out cleanly when the cookie has expired.
const useAuthSync = () => {
  const dispatch = useDispatch();
  const hasUser = useSelector((store) => !!store.auth.user);

  useEffect(() => {
    if (!hasUser) return;
    axios
      .get(`${USER_API_END_POINT}/me`)
      .then((res) => {
        if (res.data.success) dispatch(setUser(res.data.user));
      })
      .catch(() => {});
    // run once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useAuthSync;
