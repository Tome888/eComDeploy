import type { NextPage } from "next";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import BlogItem from "../../components/BlogItem";
import PageTitle from "../../components/PageTitle";
import { useRouter } from "next/router";

interface Blog {
  id: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  img: string;
  title: string;
  first_content: string;
  second_content: string;
}

interface BlogPageProps {
  blogs: Blog[];
  category: string | null;
  searchQuery: string | null;
}

const Blog: NextPage<BlogPageProps> = ({ blogs, category, searchQuery }) => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(category);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>(blogs);
  const [search, setSearch] = useState<string>(searchQuery || "");

  useEffect(() => {
    const filtered = blogs.filter((blog) => {
      const matchesCategory = activeCategory
        ? blog.category === activeCategory
        : true;
      const matchesSearch = search
        ? blog.title.toLowerCase().includes(search.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
    setFilteredBlogs(filtered);
  }, [activeCategory, search, blogs]);

  const handleFilter = (category: string) => {
    router.push(`/blog?category=${category}&q=${search}`);
    setActiveCategory(category);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    router.push(`/blog?category=${activeCategory || ""}&q=${search}`);
  };

  useEffect(() => {
    const categoryQuery = router.query.category;
    if (typeof categoryQuery === "string") {
      setActiveCategory(categoryQuery);
    } else {
      setActiveCategory(null);
    }
  }, [router.query.category]);

  return (
    <>
      <Head>
        <title>Store - Blog</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageTitle title="Blog" />

      <section className="bg0 p-t-62 p-b-60">
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-lg-9 p-b-80">
              <div className="p-r-45 p-r-0-lg">
                {filteredBlogs.length ? (
                  filteredBlogs.map((blog) => (
                    <BlogItem
                      key={blog.id}
                      img={blog.img}
                      title={blog.title}
                      excerpt={blog.excerpt}
                      author={blog.author}
                      category={blog.category}
                      id={blog.id}
                    />
                  ))
                ) : (
                  <p>No results found</p>
                )}
              </div>
            </div>

            <div className="col-md-4 col-lg-3 p-b-80">
              <div className="side-menu">
                <form
                  className="bor17 of-hidden pos-relative"
                  onSubmit={handleSearch}
                >
                  <input
                    className="stext-103 cl2 plh4 size-116 p-l-28 p-r-55"
                    type="text"
                    name="search"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="flex-c-m size-122 ab-t-r fs-18 cl4 hov-cl1 trans-04">
                    <i className="zmdi zmdi-search"></i>
                  </button>
                </form>

                <div className="p-t-55">
                  <h4 className="mtext-112 cl2 p-b-33">Categories</h4>

                  <ul>
                    <li className="bor18">
                      <button
                        className={`dis-block stext-115 cl6 hov-cl1 trans-04 p-tb-8 p-lr-4 ${
                          activeCategory === "fashion"
                            ? "active-blog-filter"
                            : ""
                        }`}
                        onClick={() => {
                          handleFilter("fashion");
                        }}
                      >
                        Fashion
                      </button>
                    </li>

                    <li className="bor18">
                      <button
                        className={`dis-block stext-115 cl6 hov-cl1 trans-04 p-tb-8 p-lr-4 ${
                          activeCategory === "beauty"
                            ? "active-blog-filter"
                            : ""
                        }`}
                        onClick={() => {
                          handleFilter("beauty");
                        }}
                      >
                        Beauty
                      </button>
                    </li>

                    <li className="bor18">
                      <button
                        className={`dis-block stext-115 cl6 hov-cl1 trans-04 p-tb-8 p-lr-4 ${
                          activeCategory === "streetstyle"
                            ? "active-blog-filter"
                            : ""
                        }`}
                        onClick={() => {
                          handleFilter("streetstyle");
                        }}
                      >
                        Street Style
                      </button>
                    </li>

                    <li className="bor18">
                      <button
                        className={`dis-block stext-115 cl6 hov-cl1 trans-04 p-tb-8 p-lr-4 ${
                          activeCategory === "lifestyle"
                            ? "active-blog-filter"
                            : ""
                        }`}
                        onClick={() => {
                          handleFilter("lifestyle");
                        }}
                      >
                        Life Style
                      </button>
                    </li>

                    <li className="bor18">
                      <button
                        className={`dis-block stext-115 cl6 hov-cl1 trans-04 p-tb-8 p-lr-4 ${
                          activeCategory === "diy" ? "active-blog-filter" : ""
                        }`}
                        onClick={() => {
                          handleFilter("diy");
                        }}
                      >
                        DIY & Crafts
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// export async function getServerSideProps(context: any) {
//   const category = context.query.category || null;
//   const searchQuery = context.query.q || null;

//   let url = "http://localhost:5001/blogs";

//   if (searchQuery) {
//     url += `?q=${searchQuery}`;
//     if (category) {
//       url += `&category_like=${category}`;
//     }
//   } else if (category) {
//     url += `?category_like=${category}`;
//   }

//   const res = await fetch(url);
//   const blogs: Blog[] = await res.json();

//   return {
//     props: {
//       blogs,
//       category,
//       searchQuery,
//     },
//   };
// }
export async function getServerSideProps(context: any) {
  const category = context.query.category || null;
  const searchQuery = context.query.q || null;

  let url = "https://hallowed-jagged-collision.glitch.me/blogs";

  if (searchQuery) {
    url += `?q=${searchQuery}`;
    if (category) {
      url += `&category_like=${category}`;
    }
  } else if (category) {
    url += `?category_like=${category}`;
  }

  const res = await fetch(url);
  const blogs: Blog[] = await res.json();

  return {
    props: {
      blogs,
      category,
      searchQuery,
    },
  };
}
export default Blog;
