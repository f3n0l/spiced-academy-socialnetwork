import { useState, useEffect } from "react";

export default function FindPeople() {
    const [recentUsers, setRecentUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("api/users/recent")
            .then((response) => response.json())
            .then((data) => {
                setRecentUsers(data);
            });
    }, []);

    useEffect(() => {
        if (searchTerm.length < 1) {
            return;
        }

        fetch("api/users/search?q=" + searchTerm)
            .then((response) => response.json())
            .then((data) => {
                setSearchResults(data);
            });
    }, [searchTerm]);

    function onChange(event) {
        setSearchTerm(event.target.value);
    }

    return (
        <section className="find-people">
            <h2>Find People</h2>
            <section className="recent-users">
                <h3>Recent Users</h3>
                <ul>
                    {recentUsers.map((user) => (
                        <li className="recentUserEntries" key={user}>
                            {user}
                        </li>
                    ))}
                </ul>
            </section>
            <section className="search-results">
                <h3>Search for Users</h3>
                <p>
                    <input
                        defaultValue={searchTerm}
                        onChange={onChange}
                        placeholder="Search for users..."
                    />
                </p>
                <ul className="searchResults">
                    {searchResults.map((user) => (
                        <li className="searchResultEntries" key={user.id}>
                            <img
                                className="avatar"
                                src={user.profile_picture_url}
                            />
                            {user.first_name} {user.last_name}
                        </li>
                    ))}
                </ul>
            </section>
        </section>
    );
}
