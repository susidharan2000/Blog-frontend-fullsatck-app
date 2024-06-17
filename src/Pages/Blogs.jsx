import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const response = await fetch("http://localhost:4000/api/post/getallpost");
    const data = await response.json();
    setBlogs(data.result);
    console.log(data);
  };
  return (
    <div>
      {blogs.map((ele, index) => {
        return (
          <div key={index}>
            <Card className="max-w-sm" imgAlt="image" imgSrc={ele.image}>
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {ele.title}
              </h5>
              <h4 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {ele.category}
              </h4>
              <p className="font-normal text-gray-700 dark:text-gray-400">
                {ele.content}
              </p>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default Blogs;