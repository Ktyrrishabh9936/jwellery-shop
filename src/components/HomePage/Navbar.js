import NavList from "./Navlist";


// components/NavBar.js
export default function NavBar() {
        return (
          <nav className="bg-gray-100 hidden lg:block">
            <div className="container mx-auto flex justify-between p-4">
              <ul className="flex space-x-4 text-gray-600">
        <div className="hidden lg:block">
          <NavList />
        </div>
              </ul>
            </div>
          </nav>
        );
      }
      