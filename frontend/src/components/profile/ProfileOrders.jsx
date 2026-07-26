import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../JS/actions/order.action";

const STATUS_LABELS = {
    paid: { label: "Payée", className: "bg-green-50 text-green-700" },
    failed: { label: "Échouée", className: "bg-red-50 text-[#c1121f]" },
};

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" });

function ProfileOrders() {
    const dispatch = useDispatch();
    const { orders, isLoad } = useSelector((state) => state.orderReducer);

    useEffect(() => {
        dispatch(getMyOrders());
    }, [dispatch]);

    if (isLoad) {
        return (
            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-bold text-neutral-900">Mes commandes</h2>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 animate-pulse rounded-lg bg-neutral-100" />
                ))}
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
                <h2 className="text-lg font-bold text-neutral-900">Mes commandes</h2>
                <p className="text-neutral-500">Aucune commande pour le moment.</p>
                <Link
                    to="/shop"
                    className="mt-2 rounded-lg bg-[#e63946] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#c1121f]"
                >
                    Découvrir la boutique
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-neutral-900">Mes commandes</h2>
            <div className="flex flex-col divide-y divide-neutral-200 rounded-lg border border-neutral-200">
                {orders.map((order) => {
                    const status = STATUS_LABELS[order.payment?.status] || STATUS_LABELS.paid;
                    return (
                        <div
                            key={order._id}
                            className="flex items-center justify-between gap-4 p-4 max-lg:flex-col max-lg:items-start"
                        >
                            <div>
                                <p className="font-semibold text-neutral-900">{order.orderNumber}</p>
                                <p className="text-sm text-neutral-500">{formatDate(order.createdAt)}</p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>
                                {status.label}
                            </span>
                            <p className="font-bold text-neutral-900">{order.total?.toFixed(2)} €</p>
                            <Link
                                to={`/order-confirmation/${order.orderNumber}`}
                                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-semibold text-neutral-700 transition-colors hover:border-[#e63946] hover:text-[#e63946]"
                            >
                                Voir détails
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ProfileOrders;
