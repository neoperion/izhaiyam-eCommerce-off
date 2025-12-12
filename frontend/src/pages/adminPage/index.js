import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { FullpageSpinnerLoader } from "../../components/loaders/spinnerIcon";
import { fetchIsUserAnAdmin } from "../../features/adminSlice/checkIfUserIsAnAdmin";

export const Index = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { checkingAdminStatusLoader } = useSelector((state) => state.adminOperations);

  // check if user is authorized to view the page
  useEffect(() => {
    const checkIfUserIsAdminFN = async () => {
      const { payload } = await dispatch(fetchIsUserAnAdmin());

      if (payload !== "success") {
        navigate("/");
      }
    };

    checkIfUserIsAdminFN();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checkingAdminStatusLoader) {
    return <FullpageSpinnerLoader />;
  } else {
    return (
      <>
        {/* All navigation is now handled by AdminLayout's Sidebar */}
        <Outlet />
      </>
    );
  }
};

export default Index;
