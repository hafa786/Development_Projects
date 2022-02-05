import { useEffect, useState } from 'react';
import style from './Posts.module.css';

type Post = {
	id: string,
	from_name: string,
	from_id: string,
	message: string,
	type: string,
	created_time:string
}

type PostsProps = {
	page: number,
	posts: Post[]
}

type PostsData = {
    data: PostsProps[]
}

type PaginationProps = {
    active: number,
    pages: number[]
}

export const Posts = ({data}: PostsData) => {
	const [users, setUsers] = useState<Array<string>>();
	const getPostsByPage = (page:number) => {
		return data?.filter(posts => posts.page === page).map(dada => (dada.posts));
	};
	const getUsersList = () => {
		const userList:string[] = [];
		if (data) {
			const userId = data?.filter(postsData => postsData.posts).slice(0,1000).map(dada => (dada.posts).map(post => post.from_id));
			userId?.map(entry => (
				entry.map(single => userList.push(single))
			));
		}
		setUsers([...new Set(userList)]);
	};
	const getPages = () => {
		if (data) {
			return data?.map(postsData => postsData.page).slice(0,1000);
		}
		return [];
	};
	const [activePage, setActivePage] = useState<number>(1);
	useEffect(() => {
		if (users === undefined) {
			getUsersList();
		}
	})
	const Pagination = ({active, pages}: PaginationProps) => {
		const pageTitle = (page: number) => {
			if(page === pages[0]) {
				return 'First';
			}
			if (page === pages[pages.length - 1]) {
				return 'Last';
			}
			return page;
		}
		return (
			<div className={style.pagination}>
				{pages.map(page => (
					<div onClickCapture={() => {setActivePage(page); console.log(page)}} key={page} className={page == active ? style.activePage : style.page}>
						{pageTitle(page)}
					</div>
				))}
			</div>
		)
	};
	const PostsList = () => {
		return (
			<div className={style.postsList}>
				<table>
					<tbody>
						<tr>
							<th>User</th>
							<th>User name</th>
							<th>Post ID</th>
							<th>Message</th>
							<th>Type</th>
							<th>Created time</th>
						</tr>
						{getPostsByPage(activePage).map((entry:Post[]) => (entry.map((single:Post) => (
							<tr key={single.id}>
								<td>{single.from_id}</td>
								<td>{single.from_name}</td>
								<td>{single.id}</td>
								<td className={style.messgae}>{single.message.slice(0, 100)}</td>
								<td>{single.type}</td>
								<td>{single.created_time}</td>
							</tr>
						))))
						}
					</tbody>
				</table>
			</div>
		)
	};
	return (
		<div className={data !== undefined? style.posts : style.disable}>
			{<Pagination pages={getPages()} active={activePage} />}
			<br />
			<PostsList />
		</div>
	)
};