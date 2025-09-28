import Folder_Data from '@/Components/New/Data/Folder_Data';
import Folder from '@/Components/New/Render/Folder_Render';
import { motion } from 'framer-motion';
import { useState } from "react";
import "@/Components/New/Render/style.css";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

export default function Trace() {
    const [expand, setExpand] = useState(true);

    return (
        <motion.div className="flex h-screen bg-gray-900 text-white shadow-lg">
            {/* Sidebar */}
            <motion.div className="w-64 flex flex-col bg-gray-800">
                <SimpleBar style={{ maxHeight: "100vh" }}>
                    <ul className="p-2">
                        <Folder_Data render={folder => (
                            <li className="list-none" key={folder.id}>
                                <Folder folder={folder} />
                            </li>
                        )} />
                    </ul>
                </SimpleBar>
            </motion.div>

            {/* Main Content */}
            <motion.div className="flex-1 p-4">
                {/* Your main page content here */}
                <h1>Main Content Area</h1>
            </motion.div>
        </motion.div>
    );
}
