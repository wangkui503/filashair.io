const Sidebar = () => {
    return (
        <>
        <aside className="fixed top-20 left-0 w-64 h-full" aria-label="Sidenav">
  <div className="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200 ">
      <ul className="space-y-2">
          <li>
              <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg md:hover:bg-gray-100 ">
                  <span className="ml-3">Dashboard</span>
              </a>
          </li>
          <li>
              <button type="button" className="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group md:hover:bg-gray-100 ">
                  <span className="flex-1 ml-3 text-left whitespace-nowrap">Pages</span>
                  <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg> 
              </button>
          </li>
          <li>
              <button type="button" className="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group md:hover:bg-gray-100 " aria-controls="dropdown-sales" data-collapse-toggle="dropdown-sales">
                  <span className="flex-1 ml-3 text-left whitespace-nowrap">Sales</span>
                  <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
              </button>
          </li>
          <li>
              <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg md:hover:bg-gray-100 ">
                  <span className="flex-1 ml-3 whitespace-nowrap">Emails</span>
                  <span className="inline-flex justify-center items-center w-5 h-5 text-xs font-semibold rounded-full text-primary-800 bg-primary-100 ">
                      6   
                  </span>
              </a>
          </li>
          <li>
              <button type="button" className="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group md:hover:bg-gray-100 " aria-controls="dropdown-authentication" data-collapse-toggle="dropdown-authentication">
                  <span className="flex-1 ml-3 text-left whitespace-nowrap">Analytics</span>
                  <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
              </button>
          </li>
      </ul>
      <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200 ">
          <li>
              <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 md:hover:bg-gray-100 ">
                  <span className="ml-3">Calendar</span>
              </a>
          </li>
          <li>
              <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 md:hover:bg-gray-100 ">
                  <span className="ml-3">Receipts</span>
              </a>
          </li>
          <li>
              <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg transition duration-75 md:hover:bg-gray-100 ">
                  <span className="ml-3">Settings</span>
              </a>
          </li>
      </ul>
  </div>
</aside>
</>
    )
}

export default Sidebar;