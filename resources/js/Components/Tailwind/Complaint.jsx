import React from "react";

const ComplaintStech = React.lazy(() => import("./Complaints/ComplaintStech"));
const ComplaintSimple = React.lazy(() =>
    import("./Complaints/ComplaintSimple")
);
const Complaint = ({ which, data }) => {
    const getComplaint = () => {
        switch (which) {
            case "ComplaintStech":
                return <ComplaintStech data={data} />;
            case "ComplaintSimple":
                return <ComplaintSimple data={data} />;

            default:
                return (
                    <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">
                        - No Hay componente <b>{which}</b> -
                    </div>
                );
        }
    };
    return getComplaint();
};

export default Complaint;
