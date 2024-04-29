import { Store } from "@/models/Store";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import PreferencePage from "./components/preference-page";
import { Category } from "@/models/Category";
import { Billboard } from "@/models/Billboard";
import { format } from "date-fns";
import { CategoryColumn } from "./components/categories/columns";
import { Property } from "@/models/Property";
import { PropertyColumn } from "./components/properties/columns";


interface PreferencesPage {
  params: { storeid: string }
};


const Preferences: React.FC<PreferencesPage> = async ({ params }) => {
  const session = await getServerSession(authOptions)
  const store = await Store.findOne({ _id: params.storeid, userId: session?.user.id })
  const allCategories = await Category.find({ storeId: params.storeid })
    .populate({
      path: 'billboardId',
      model: 'Billboard',
    })
  const billboards = await Billboard.find({ storeId: params.storeid })
  const allProperties = await Property.findOne({ storeId: params.storeid })

  const formattedCategories: CategoryColumn[] = allCategories.map((item) => ({
    id: item._id,
    name: item.name,
    billboardId: item.billboardId?._id,
    label: item.billboardId?.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    billboards: billboards
  }));
  const formattedProperties:PropertyColumn[] = allProperties?.properties.map((property:any) => {
    const { label, values, _id } = property;
    const formattedValues = values.map((item:any) => {
      const { name, value, _id } = item;
      return{name, value, id:_id, createdAt: format(allProperties.createdAt, 'MMMM do, yyyy')}
  });
  
    return {
      label,
      _id,
      values: formattedValues,
    };
  });

  return (
    <PreferencePage storeData={JSON.parse(JSON.stringify(store))}
      billboardData={JSON.parse(JSON.stringify(billboards))}
      formattedCategories={JSON.parse(JSON.stringify(formattedCategories))}
      formattedProperties={JSON.parse(JSON.stringify(formattedProperties || {}))}

    />

  )
}

export default Preferences;

