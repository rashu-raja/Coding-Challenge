import { useState, useEffect } from "react";
import { useAuth } from "../Context/useAuth";
import { Link } from "react-router-dom";

function Users() {
  const {
    token,
    itemsPerPage,
    designations,
    departments,
    favorites,
    toggleFavorite,
  } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterDesignation, setFilterDesignation] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [
    itemsPerPage,
    search,
    sortField,
    sortDirection,
    filterDesignation,
    filterDepartment,
  ]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage,
          per_page: itemsPerPage,
          search,
          sort_by: sortField,
          sort_dir: sortDirection,
        });

        if (filterDesignation) params.append("designation", filterDesignation);
        if (filterDepartment) params.append("department", filterDepartment);

        const response = await fetch(
          `http://127.0.0.1:8000/api/users?${params}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsers(data.data);
        setTotalPages(data.meta.last_page);
        setTotalUsers(data.meta.total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [
    token,
    currentPage,
    itemsPerPage,
    search,
    sortField,
    sortDirection,
    filterDesignation,
    filterDepartment,
  ]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus == 1 ? 0 : 1;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field)
      return <span className="text-base-content/20 ml-1">↕</span>;
    return <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-base-200">
          {/* Search */}
          <label className="input input-bordered flex items-center gap-2 w-full sm:max-w-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 text-base-content/50 shrink-0"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Search by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-base-content/40 hover:text-base-content"
              >
                ✕
              </button>
            )}
          </label>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <select
              className="select select-bordered select-sm"
              value={filterDesignation}
              onChange={(e) => setFilterDesignation(e.target.value)}
            >
              <option value="">All Designations</option>
              {designations.map((d) => (
                <option key={d.designation} value={d.designation}>
                  {d.designation}
                </option>
              ))}
            </select>

            <select
              className="select select-bordered select-sm"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.department} value={d.department}>
                  {d.department}
                </option>
              ))}
            </select>

            {(filterDesignation || filterDepartment) && (
              <button
                className="btn btn-sm btn-ghost text-base-content/50"
                onClick={() => {
                  setFilterDesignation("");
                  setFilterDepartment("");
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {error && !loading && (
          <div className="alert alert-error m-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            {/* Result count */}
            <div className="px-4 pt-3 pb-1">
              <span className="text-sm text-base-content/50">
                {totalUsers} user{totalUsers !== 1 ? "s" : ""} found
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr className="bg-base-200">
                    <th>#</th>
                    <th
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("name")}
                    >
                      Name <SortIcon field="name" />
                    </th>
                    <th
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("designation")}
                    >
                      Designation <SortIcon field="designation" />
                    </th>
                    <th
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("department")}
                    >
                      Department <SortIcon field="department" />
                    </th>
                    <th
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("email")}
                    >
                      Email <SortIcon field="email" />
                    </th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>
                      <span className="text-warning">★</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const isFav = favorites.some((f) => f.id === user.id);
                    return (
                      <tr key={user.id ?? index} className="hover">
                        <td className="text-base-content/50 text-sm">
                          {(currentPage - 1) * itemsPerPage + index + 1}
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
                          <button
                            onClick={() =>
                              handleStatusToggle(user.id, user.status)
                            }
                            className={`badge badge-sm cursor-pointer border-0 ${
                              user.status == 1 ? "badge-success" : "badge-error"
                            }`}
                          >
                            {user.status == 1 ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td>
                          <div
                            className="tooltip"
                            data-tip={
                              isFav ? "Remove favorite" : "Add favorite"
                            }
                          >
                            <button
                              onClick={() => toggleFavorite(user)}
                              className="btn btn-ghost btn-xs text-lg"
                            >
                              <span
                                className={
                                  isFav
                                    ? "text-warning"
                                    : "text-base-content/30"
                                }
                              >
                                {isFav ? "★" : "☆"}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="text-center py-16 text-base-content/40">
                  No users found.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-base-200">
              <span className="text-sm text-base-content/50">
                Page {currentPage} of {totalPages}
              </span>
              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  « Prev
                </button>
                <button
                  className="join-item btn btn-sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next »
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Users;
