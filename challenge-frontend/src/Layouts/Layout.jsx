import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../Context/useAuth";
import { useEffect } from "react";

function Layout({ children }) {
  const { isLoggedIn, user, logout, theme, setTheme } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const linkClass = ({ isActive }) =>
    `text-base-content hover:bg-base-content/10 rounded-xl font-medium is-drawer-close:tooltip is-drawer-close:tooltip-right ${
      isActive
        ? "bg-primary text-primary-content"
        : "text-base-content hover:bg-base-content/10"
    }`;

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content overflow-visible flex flex-col min-h-screen">
          {/* Navbar */}
          <div className="navbar bg-base-100 border-b border-base-300 shadow-none overflow-visible sticky top-0 z-50">
            <div className="flex-1 flex items-center gap-2">
              <label
                htmlFor="my-drawer-4"
                className="btn btn-ghost btn-sm btn-square lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </label>
              <a className="text-xl font-black tracking-tight text-base-content">
                daisy<span className="text-indigo-500">UI</span>
              </a>
            </div>

            {isLoggedIn ? (
              <div className="flex-none">
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar mr-5"
                  >
                    <div className="w-10 rounded-full">
                      <img
                        src={
                          user?.user_pictures?.length > 0
                            ? `http://127.0.0.1:8000/storage/${user.user_pictures[0].path}`
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                user?.name || "User"
                              )}`
                        }
                        alt={user?.name || "User"}
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
                  >
                    <li>
                      <a>Settings</a>
                    </li>
                    <li>
                      <button onClick={logout}>Logout</button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                to="/register"
                className="btn btn-sm bg-slate-900 hover:bg-slate-700 text-white border-0 rounded-lg px-5 font-semibold"
              >
                Register
              </Link>
            )}
          </div>

          {/* Page content */}
          <div className="p-6 bg-base-200 flex-1">{children}</div>
        </div>

        {/* Sidebar */}
        <div className="drawer-side is-drawer-close:overflow-visible z-40">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="flex min-h-full flex-col items-start bg-base-300 is-drawer-close:w-14 is-drawer-open:w-64 transition-all duration-300">
            <ul className="menu w-full grow px-2 py-3 gap-0.5">
              <li>
                <label
                  htmlFor="my-drawer-4"
                  aria-label="open sidebar"
                  className="btn btn-square btn-ghost btn-sm text-base-content hover:bg-base-content/10 mb-2 ml-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                    className="inline-block size-4"
                  >
                    <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                    <path d="M9 4v16"></path>
                    <path d="M14 10l2 2l-2 2"></path>
                  </svg>
                </label>
              </li>

              <div className="h-px bg-base-content/10 mx-2 mb-2"></div>

              <li>
                <NavLink to="/" className={linkClass} data-tip="Homepage">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                    className="inline-block size-4 shrink-0"
                  >
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  </svg>
                  <span className="is-drawer-close:hidden">Homepage</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/users" className={linkClass} data-tip="Users">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                    className="inline-block size-4 shrink-0"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span className="is-drawer-close:hidden">Users</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/favorites"
                  className={linkClass}
                  data-tip="Favorites"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                    className="inline-block size-4 shrink-0"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span className="is-drawer-close:hidden">Favorites</span>
                </NavLink>
              </li>
            </ul>

            <div className="w-full px-2 py-3 border-t border-base-content/10">
              <button
                onClick={toggleTheme}
                className="btn btn-ghost btn-sm w-full flex items-center gap-2 text-base-content hover:bg-base-content/10 is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip={theme === "light" ? "Dark Mode" : "Light Mode"}
              >
                {theme === "light" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                    className="size-4 shrink-0"
                  >
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2"
                    fill="none"
                    stroke="currentColor"
                    className="size-4 shrink-0"
                  >
                    <circle cx="12" cy="12" r="4"></circle>
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
                  </svg>
                )}
                <span className="is-drawer-close:hidden">
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;
