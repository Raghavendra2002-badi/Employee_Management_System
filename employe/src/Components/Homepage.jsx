import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaUsers, FaPlus, FaCogs, FaChartBar, FaShieldAlt } from "react-icons/fa";

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div
            className="d-flex flex-column justify-content-center align-items-center min-vh-100 px-4 text-center"
            style={{
                background: "linear-gradient(to right, #E0EAFC, #CFDEF3)",
                fontFamily: "'Inter', sans-serif",
                overflow: "hidden",
            }}
        >
            {/* HERO SECTION */}
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="mb-5"
            >
                <h1 className="fw-bold display-4 text-dark">
                    Empower Your Workforce with <span className="text-primary">EMS</span>
                </h1>
                <p className="text-muted fs-5 mt-3">
                    A powerful Employee Management System to simplify HR operations.
                </p>
                <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
                    <Button
                        variant="primary"
                        size="lg"
                        className="rounded-pill px-4 shadow"
                        onClick={() => navigate("/employees")}
                    >
                        <FaUsers className="me-2" />
                        View Employees
                    </Button>
                    <Button
                        variant="outline-dark"
                        size="lg"
                        className="rounded-pill px-4 shadow-sm"
                        onClick={() => navigate("/employees", { state: { scrollToAdd: true } })}
                    >
                        <FaPlus className="me-2" />
                        Add Employee
                    </Button>
                </div>
            </motion.div>

            {/* FEATURE CARDS */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="w-100"
            >
                <div className="container">
                    <div className="row g-4 justify-content-center">
                        {[
                            {
                                icon: <FaCogs size={36} className="text-primary mb-2" />,
                                title: "Automation",
                                desc: "Automate repetitive tasks and save time.",
                            },
                            {
                                icon: <FaChartBar size={36} className="text-success mb-2" />,
                                title: "Analytics",
                                desc: "Gain insights into performance trends.",
                            },
                            {
                                icon: <FaShieldAlt size={36} className="text-danger mb-2" />,
                                title: "Security",
                                desc: "Your data is encrypted and protected.",
                            },
                        ].map((feature, idx) => (
                            <div className="col-10 col-md-4" key={idx}>
                                <div
                                    className="p-4 bg-white rounded-4 shadow-sm h-100 hover-shadow transition"
                                    style={{ transition: "0.3s ease-in-out" }}
                                >
                                    {feature.icon}
                                    <h5 className="fw-semibold mt-2">{feature.title}</h5>
                                    <p className="text-muted">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* FOOTER */}
            <div className="text-muted mt-5 small">
                &copy; {new Date().getFullYear()} EMS — Built with 💙
            </div>
        </div>
    );
}
