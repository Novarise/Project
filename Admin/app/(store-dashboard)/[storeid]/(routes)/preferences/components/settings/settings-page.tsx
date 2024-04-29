import { SettingsForm } from '@/app/(store-dashboard)/[storeid]/(routes)/preferences/components/settings/settings-form'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { Store } from '@/models/Store'
import { getServerSession } from 'next-auth'

interface SettingsPageProp {
    params: { storeid: string }
};


const SettingsPage: React.FC<SettingsPageProp> = async ({ params }) => {
const session = await getServerSession(authOptions)
    const store = await Store.findOne({ _id: params.storeid, userId: session?.user.id })
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <SettingsForm initialData={JSON.parse(JSON.stringify(store))} />
        </div>
    )
}

export default SettingsPage