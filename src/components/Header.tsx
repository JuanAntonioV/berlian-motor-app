import MainBreadcrumb from './MainBreadcrumb';
import MenuSearch from './MenuSearch';
import Profile from './Profile';
import SearchMenuDialog from './SearchMenuDialog';

export default function Header() {
  return (
    <header className='w-full border-b bg-white shadow'>
      <div className='px-4 md:px-10 h-16 flexCenter'>
        <div className='flexBetween w-full'>
          <div className='flexStart gap-x-4'>
            <MenuSearch />
            <SearchMenuDialog />
            {/* <SidebarMobile /> */}
          </div>
          <div className='flexEnd gap-x-4'>
            <Profile />
          </div>
        </div>
      </div>
      <div className='border-t border-t-gray-200 h-12 flexStart px-4 md:px-10'>
        <MainBreadcrumb />
      </div>
    </header>
  );
}
