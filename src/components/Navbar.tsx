import React from "react";

const Navbar: React.FC = () => {
    return (
        <nav className="bg-background px-4 py-2 shadow-md border-b-2 border-borderHighContrast">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-center text-foreground text-sans">Blocku</h1>
            </div>
        </nav>
    );
};

export default Navbar;
