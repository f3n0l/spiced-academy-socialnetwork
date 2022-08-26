import { useState, useEffect } from "react";
import ProfilePicture from "./profilepicture";
import { Link } from "react-router-dom";

//create userlist

export default function FindPeople() {
    const [recentUsers, setRecentUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("api/users/recent?limit=3")
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

    function UserList({ users }) {
        return !users.length ? (
            "Start Searching!"
        ) : (
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <Link to={`/users/${user.id}`}>
                            <ProfilePicture
                                profile_picture_url={user.profile_picture_url}
                            />
                            {user.first_name} {user.last_name}
                        </Link>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        //insert userlist instead UL -> UserList users={recentUsers}
        <section className="find-people">
            <h2>Find People</h2>
            <section className="recent-users">
                <h3>Recent Users</h3>
                <UserList users={recentUsers}></UserList>
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
                <UserList users={searchResults}></UserList>
            </section>
        </section>
    );
}
