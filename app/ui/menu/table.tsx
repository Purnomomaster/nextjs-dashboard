import { Menu } from "@/app/lib/definitions";
// import { copyMenu } from "@/app/lib/actions";
import { useFormState } from 'react-dom';

interface MenuTableProps {
    menus: Menu[];
}

export default function MenuTable({ menus }: MenuTableProps) {
    const initialState = { message: '' };
    // const [state, dispatch] = useFormState(copyMenu, initialState);

    return (
        <table className="w-full mt-4 border">
            <thead>
                <tr className="border-b">
                    <th className="p-2">Nama Menu</th>
                    <th className="p-2">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {menus.map((menu: Menu) => (
                    <tr key={menu.id} className="border-b">
                        <td className="p-2">{menu.title}</td>
                        <td className="p-2">
                            {/* <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => dispatch(menu.id)}
                            >
                                Copy Menu
                            </button> */}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}