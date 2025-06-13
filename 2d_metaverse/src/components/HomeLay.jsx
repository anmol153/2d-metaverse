import { useChatStore } from '../store/useChatStore'
import NoChatSelected from './NoChatSelected';
import Chatselected from './Chatselected';
import SideBar from './SIdeBar';


const HomeLay = () => {
  const {selectedUser}  = useChatStore();
  console.log(selectedUser);
  return (
    <div className="h-screen bg-base-200">
      <div className='flex items-center justify-center pt-20 px-4'>
        <div className='bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]'>
          <div className='flex h-full rounded-lg overflow-hidden'>
            <SideBar/>
            {selectedUser? <Chatselected/> : <NoChatSelected/>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeLay;