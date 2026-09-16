import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../JS/actions/order.action";

const STATUS_LABELS = {
    paid: { label: "Paid", className: "profile-status profile-status--success" },
    failed: { label: "Failed", className: "profile-status profile-status--error" },
};

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

function ProfileOrders() {
    const dispatch = useDispatch();
    const { orders, isLoad } = useSelector((state) => state.orderReducer);

    useEffect(() => {
        dispatch(getMyOrders());
    }, [dispatch]);

    if (isLoad) {
        return (
            <div className="profile-orders__skeleton">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="profile-orders__skeleton-row" />
                ))}
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="profile-empty">
                <p className="profile-empty__text">No orders yet.</p>
                <Link to="/shop" className="btn-primary">
                    Browse the shop
                </Link>
            </div>
        );
    }

    return (
        <div className="profile-orders">
            {orders.map((order) => {
                const status = STATUS_LABELS[order.payment?.status] || STATUS_LABELS.paid;
                return (
                    <div key={order._id} className="profile-order-row">
                        <div>
                            <p className="profile-order-row__number">{order.orderNumber}</p>
                            <p className="profile-order-row__date">{formatDate(order.createdAt)}</p>
                        </div>
                        <span className={status.className}>{status.label}</span>
                        <p className="profile-order-row__total">{order.total?.toFixed(2)} €</p>
                        <Link
                            to={`/order-confirmation/${order.orderNumber}`}
                            className="btn-secondary profile-order-row__link"
                        >
                            View details
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}

export default ProfileOrders;
