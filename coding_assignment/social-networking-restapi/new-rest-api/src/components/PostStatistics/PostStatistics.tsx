import { useEffect, useState } from 'react';
import style from './PostStatistics.module.css';

type Post = {
	id: string,
	from_name: string,
	from_id: string,
	message: string,
	tpye: string,
	created_time: string
}

type PostsProps = {
	page: number,
	posts: Post[]
}

type PostsData = {
    data: PostsProps[]
}

type PostsByUser = {
	from: string,
	count: number
	posts: Post[]
}

export const PostStatistics = ({data}: PostsData) => {
	const [users, setUsers] = useState<Array<string>>();
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
	const generatePostsListByUsers = () => {
		const postsssList:Post[] = [];
		const postsByUser: PostsByUser[] = [];
		if (data) {
			const userId = data?.filter(postsData => postsData.posts).slice(0,1000).map(dada => (dada.posts));
			userId?.map(entry => (
				entry.map(single => postsssList.push(single))
			));
		}
		if (users) {
			users.map(user =>  postsByUser.push({from: user, count: postsssList.filter(posts => posts.from_id === user).length, posts: postsssList.filter(posts => posts.from_id === user)}));
		}
		return [...new Set(postsByUser)];
	}
	useEffect(() => {
		if (users === undefined) {
			getUsersList();
		}
	});
	const getAverageNumberOfCharacters = (posts: Post[]) => {
		const messages = posts.map(post => post.message);
		return ((messages.join().length) / posts.length).toFixed(2);
	}
	const getLongestPostByEachUser = (posts: Post[]) => {
		posts.sort((firstItem: any, secondItem:any) => firstItem.message - secondItem.message);
		return JSON.stringify(posts[0].id);
	}
	const getNumberOfPostsEachMonth = (posts: Post[]) => {
		const postCreatedDates = posts.map(post => (new Date(post.created_time).getMonth()+1) + '-' +  new Date(post.created_time).getFullYear());
		return [...(postCreatedDates.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())).entries()];
	}
	return (
		<div className={data !== undefined? style.posts : style.disable}>
			<h3>Posts statistics</h3>
			<table>
				<tbody>
					<tr>
						<th>User</th>
						<th>Total posts by user</th>
						<th>Average number of characters</th>
						<th>Longest post</th>
						<th>Number of posts made each month</th>
					</tr>
					{generatePostsListByUsers().map((postByUser:PostsByUser) => (
						<tr key={postByUser.from}>
							<td>{postByUser.from}</td>
							<td>{postByUser.count}</td>
							<td>{getAverageNumberOfCharacters(postByUser.posts)}</td>
							<td>{getLongestPostByEachUser(postByUser.posts)}</td>
							<td>{
								getNumberOfPostsEachMonth(postByUser.posts).map(entry => (
									<span key={entry[0]}><strong>{entry[0]}</strong> : {entry[1]}<br /></span>
								))}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
};