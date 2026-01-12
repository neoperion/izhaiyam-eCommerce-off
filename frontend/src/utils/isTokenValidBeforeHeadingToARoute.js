import { fetchIsTokenValid } from "../features/authSlice/fetchIsTokenValid";

export async function isTokenValidBeforeHeadingToRoute(dispatch, navigate) {
  const isValid = await dispatch(fetchIsTokenValid());
  if (!isValid.payload) {
    navigate("/login");
  }
}
