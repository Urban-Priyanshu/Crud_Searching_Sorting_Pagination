import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import _ from "lodash";


const Home = () => {
  const [users, setUser] = useState([]); 
  const [loaded, setLoaded] = useState(false);
  const [order, setorder] = useState("ASC");
  const [searchTerm, setsearchTerm] = useState("")
  const [paginatedUsers, setpaginatedUsers] = useState();
  const [currentPage, setcurrentPage] = useState(1);

  const pageSize = 10;

  const loadUsers = async () => {
    
      const result = await axios.get("http://localhost:3003/users");
      setUser(result.data);
      setpaginatedUsers(_(result.data).slice(0).take(pageSize).value());
      
         
  };



  useEffect(async () => {
    if(!loaded) {
      await loadUsers();
      setLoaded(true);
    }
  }, []);

 

  
    const deleteUser = async id => {
      await axios.delete(`http://localhost:3003/users/${id}`);
      loadUsers();
    };

  //   const onSortBy = (sortBy) => {
  //     const tempUsers = sortUsers(sortBy);
  //     setUser(tempUsers);
  //   }

  // const sortUsers = (sortByField) => {

  //   return users.slice().sort((a, b) =>
  //       a[sortByField]?.localeCompare(b[sortByField])
  //     );

  const onSortBy = (sortBy) => {
    if(order === "ASC"){
      const sorted = [...paginatedUsers].sort((a, b) => 
      a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ? 1 : -1 
      );
      setpaginatedUsers(sorted);
      setorder("DSC");
    }
    else if(order === "DSC"){
      const sorted = [...paginatedUsers].sort((a, b) => 
      a[sortBy].toLowerCase() < b[sortBy].toLowerCase() ? 1 : -1
      );
      setpaginatedUsers(sorted);
      setorder("ASC");
    }

  };

  const pageCount = users? Math.ceil(users.length/pageSize) : 0;
  if (pageCount === 1) return null;
  const pages = _.range(1, pageCount+1);

  const pagination = (pageNo) => {
    setcurrentPage(pageNo);
    const startIndex = (pageNo-1)*pageSize;
    const paginatedUser = _(users).slice(startIndex).take(pageSize).value();
    setpaginatedUsers(paginatedUser)

  }
  
 
  return (
    
    <div className="container">
      <div className="py-4">
        
        <h1>Home Page</h1>
        <input 
        type="text"
        placeholder="Search..."
        className="form-control"
        style={{marginTop: 50, marginBottom:20, width: "40%"}}
        onChange={(e)=>{
          setsearchTerm(e.target.value);
        }}
        
         />
         {
          !paginatedUsers ? ("No data found"):(
         

          <table  class="table border shadow">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Serial_No.</th>
              <th scope="col" onClick={() => onSortBy('firstname')} >FirstName</th>
              <th scope="col" onClick={() => onSortBy('lastname')}>LastName</th>
              <th scope="col"  onClick={() => onSortBy('email')}>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.filter((val) => {
              if(searchTerm === "") {
                return val;
              }else if(
                val.firstname.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
                val.lastname.toLowerCase().includes(searchTerm.toLocaleLowerCase())  ||
                val.email.toLowerCase().includes(searchTerm.toLocaleLowerCase())
              ){
                return val;
              }
            }).map((user, index) => (
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email}</td>
                <td>
                  <Link class="btn btn-primary mr-2" to={`/users/${user.id}`}>
                    View
                  </Link>
                  <Link
                    class="btn btn-outline-primary mr-2"
                    to={`/users/edit/${user.id}`}
                  >
                    Edit
                  </Link>
                  <Link
                    class="btn btn-danger"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )
      }
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            {
              pages.map((page) => (
                <li className= {
                  page === currentPage? "page-item active" : "page-item"
                }>
                  <p className="page-link"
                  onClick={()=>pagination(page)}>
                  {page}
                  </p>
                </li>
              ))
            }

          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Home;
