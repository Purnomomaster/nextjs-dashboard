import { Menu } from '@/app/lib/definitions';
import { DeleteMenu } from './buttons';
import { DeleteFileButton } from './deletefile';
import { EditMenuDialog } from "./editdialog"
import * as HeroIcons from "@heroicons/react/24/outline"
import { CreateMenuDialog } from '@/app/ui/menu/createdialog';


interface MenuTableProps {
  menus: Menu[];
}
export default function MenuTable({ menus }: MenuTableProps) {
  const initialState = { message: '' };
  return (
    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-5 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-5 text-left text-sm font-semibold text-gray-900">
                    Description
                  </th>
                  <th scope="col" className="px-4 py-5 text-left text-sm font-semibold text-gray-900">
                    Icon
                  </th>
                  <th scope="col" className="px-4 py-5 text-left text-sm font-semibold text-gray-900">
                    Levels
                  </th>
                  <th scope="col" className="px-4 py-5 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {menus.map((menu) => {
                  // Dynamically render the icon if it exists
                  const IconComponent =
                    menu.icon.trim() && HeroIcons[menu.icon.trim() as keyof typeof HeroIcons]
                      ? HeroIcons[menu.icon.trim() as keyof typeof HeroIcons]
                      : null

                  // Calculate the highest lv2 value for menus with the same lv1 value
                  const highestLv2 = menus
                    .filter((m) => (m.lv1 || 0) === (menu.lv1 || 0))
                    .reduce((highest, m) => {
                      const lv2Value = m.lv2 || 0
                      return lv2Value > highest ? lv2Value : highest
                    }, 0)

                  return (
                    <tr key={menu.id} className="group">
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-900">{menu.name.trim()}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">{menu.description.trim()}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                        {IconComponent && <IconComponent className="h-5 w-5" />}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                        {menu.lv1 || 0}/{menu.lv2 || 0}/{menu.lv3 || 0}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <EditMenuDialog menu={menu} menus={menus} />
                          <DeleteMenu id={menu.id} />
                          <DeleteFileButton id={menu.id} name={menu.name.trim()} />
                          <CreateMenuDialog
                            menus={menus}
                            highestLv1={0}
                            highestLv2={highestLv2}
                            parentLv1={menu.lv1 || 0}
                            buttonSize="icon"
                            btnname='Lv2'
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}



// return (
//   <div className="w-full">
//     <div className="mt-6 flow-root">
//       <div className="overflow-x-auto rounded-md bg-gray-50 p-2">
//         <table className="min-w-full divide-y divide-gray-200 text-sm">
//           <thead className="hidden sm:table-header-group bg-gray-50 text-left">
//             <tr>
//               <th scope="col" className="px-4 py-3 font-medium sm:w-1/4">
//                 Id
//               </th>
//               <th scope="col" className="px-4 py-3 font-medium sm:w-1/4">
//                 Name
//               </th>
//               <th scope="col" className="px-4 py-3 font-medium sm:w-1/4">
//                 Price
//               </th>
//               <th scope="col" className="px-4 py-3 text-right font-medium sm:w-1/4">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {menus?.map((menu) => (
//               <tr
//                 key={menu.id}
//                 className="group block rounded-lg bg-white p-4 shadow-sm sm:table-row sm:rounded-none sm:shadow-none sm:p-0"
//               >
//                 <td className="block px-0 py-2 sm:table-cell sm:whitespace-nowrap sm:px-4 sm:py-5">
//                   <div className="font-medium sm:hidden">Id</div>
//                   <p>{menu.id}</p>
//                 </td>
//                 <td className="block px-0 py-2 sm:table-cell sm:whitespace-nowrap sm:px-4 sm:py-5">
//                   <div className="font-medium sm:hidden">Name</div>
//                   <p>{menu.name}</p>
//                 </td>
//                 <td className="block px-0 py-2 sm:table-cell sm:whitespace-nowrap sm:px-4 sm:py-5">
//                   <div className="font-medium sm:hidden">Price</div>
//                   {/* <p>{formatCurrency(product.price)}</p> */}
//                   tes price
//                 </td>
//                 <td className="block px-0 py-2 sm:table-cell sm:whitespace-nowrap sm:px-4 sm:py-5">
//                   <div className="flex justify-end gap-2">
//                     <EditMenuDialog menu={menu} />
//                     <DeleteMenu id={menu.id} />
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>
// );