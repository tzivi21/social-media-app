import React, { useEffect, useReducer, useState } from 'react';
import Post from '../components/Post';
import styles from '../css/Posts.module.css'; // Import the CSS module
import PostForm from '../components/PostForm';

function Posts(props) {
  const [posts, setPosts] = useState({ allPosts: [], postsOnScreen: [] });
  const [popPost, setPopPost] = useState(false);
  const [add, setAdd] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    props.setInfo(false);
    fetch(`http://localhost:3000/users/${props.currentUser.id}/posts`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("failed to find posts");
        }
        return response.json();
      })
      .then((posts) => {
        setPosts({ allPosts: posts, postsOnScreen: posts });
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  function handleSearchInputChange(event) {
    setSearchInput(event.target.value);
  }
  function searchPosts() {
    if (searchInput.trim() === '') {
      // If search input is empty, reset posts to show all
      fetch(`http://localhost:3000/users/${props.currentUser.id}/posts`)
        .then((response) => response.json())
        .then((posts) => {
          setPosts({ allPosts: posts, postsOnScreen: posts });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // Search posts based on ID or title
      const searchTerm = searchInput.toLowerCase().trim();
      const filteredPosts = posts.allPosts.filter(
        (post) =>
          post.id.toString().includes(searchTerm) || post.title.toLowerCase().includes(searchTerm)
      );
      setPosts({ allPosts: posts.allPosts, postsOnScreen: filteredPosts });
    }
  }

  function showAddPost() {
    setAdd(true);
  }
  function handleAdd(title, body) {
    const newPostData = {
      title: title,
      body: body,
      userId: props.currentUser.id,
    };
    fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPostData),
    })
      .then((data) => {
        if (!data.ok) {
          throw new Error("can't create the post");
        }
        return data.json();
      })
      .then((response) => {
        let newArray = posts.allPosts;
        newArray.push(response);
        setPosts({ allPosts: newArray, postsOnScreen: newArray });
        setAdd(false);
      }).finally(() => {
        searchPosts();
      })
      .catch(error => {
        console.error('Error creating user:', error);
      });
  }



  return (
    <>
      <div >
        <div className={styles.actions}>
          <button className={styles.button} onClick={showAddPost}>Add Post</button>
          <div>
            <input
              type="text"
              placeholder="Search by ID or Title"
              value={searchInput}
              onChange={handleSearchInputChange}
              className={styles.input}
            />
            <button className={styles.button} onClick={searchPosts}>
              Search
            </button>
          </div>
        </div>
        {add && <PostForm
          setForm={setAdd}
          formType={'Add'}
          handleSubmit={handleAdd}
          title={null}
          body={null} />}
        <div className={popPost ? styles.pop : styles.notPop}>
          <div className={styles.postsContainer}>
            {posts.allPosts.length === 0 && <p>You have no posts, feel free to create a new post😜</p>}
            {posts.postsOnScreen.map((p, index) => {
              return <Post
                posts={posts}
                setPosts={setPosts}
                key={p.id}
                currentPost={p}
                className={styles.post}
                setPopPost={setPopPost}
                currentUser={props.currentUser}
                searchPosts={searchPosts} />;
            })}
          </div>
        </div>
      </div>

    </>
  );
}

export default Posts;
