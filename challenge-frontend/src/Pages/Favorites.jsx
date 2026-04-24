import { useAuth } from "../Context/useAuth";
import { Link } from "react-router-dom";

function Favorites() {
  const { favorites, toggleFavorite } = useAuth();

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="currentColor"
              stroke="currentColor"
              className="inline-block size-5 text-warning"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <h2 className="font-semibold text-base-content text-lg">
              Favorite Users
            </h2>
          </div>
          <span className="badge badge-primary badge-outline">
            {favorites.length} saved
          </span>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-base-content/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="1.5"
              fill="none"
              stroke="currentColor"
              className="size-14 text-base-content/20"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <p className="text-base font-medium">No favorites yet</p>
            <p className="text-sm text-base-content/30">
              Star a user from the Users page to save them here.
            </p>
            <Link to="/users" className="btn btn-primary btn-sm mt-2">
              Browse Users
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr className="bg-base-200">
                  <th>#</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((user, index) => (
                  <tr key={user.id} className="hover">
                    <td className="text-base-content/50 text-sm">
                      {index + 1}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <Link to={`/user/${user.id}/profile`}>
                          {user.user_pictures?.length > 0 ? (
                            <div className="avatar">
                              <div className="w-10 h-10 rounded-full">
                                <img
                                  src={`http://127.0.0.1:8000/storage/${user.user_pictures[0].path}`}
                                  alt={user.name}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="avatar placeholder">
                              <div className="w-10 h-10 rounded-full bg-primary text-primary-content">
                                <span className="text-sm font-bold">
                                  {user.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          )}
                        </Link>
                        <span className="font-semibold">{user.name}</span>
                      </div>
                    </td>
                    <td className="text-base-content/70">
                      {user.designation ?? "—"}
                    </td>
                    <td className="text-base-content/70">
                      {user.department ?? "—"}
                    </td>
                    <td className="text-base-content/70">{user.email}</td>
                    <td className="text-base-content/70">
                      {user.phone ?? "—"}
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm border-0 ${
                          user.status == 1 ? "badge-success" : "badge-error"
                        }`}
                      >
                        {user.status == 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div
                        className="tooltip tooltip-left"
                        data-tip="Remove from favorites"
                      >
                        <button
                          onClick={() => toggleFavorite(user)}
                          className="btn btn-ghost btn-xs text-lg text-warning hover:text-error transition-colors"
                        >
                          ★
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites;
