import { useEffect, useState, useRef, useContext } from "react";
import { channelType } from "../../../types/messages.ts";
import "./side_bar.css";
import { Link, NavLink } from "react-router-dom";
import useClickOutside from "../../../hooks/useClickOutside.tsx";
import axios from "axios";
import ProfilePic from "../profile_pic.tsx";
import ChannelListContext from "../../../contexts/channelListContext.ts";
import { ACTION } from "../../../reducers/channelReducer.ts";
import { TailSpin } from "react-loader-spinner";

function SideBar() {
	const [activeButton, setActiveButton] = useState(
		"all" as "all" | "user" | "group",
	);
	const [displayJoinGroupMenu, setDisplayJoinGroupMenu] = useState(false);
	const { dispatch, channelDispatch, loading, changeLoading } =
		useContext(ChannelListContext);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const additionalRef = useRef<HTMLButtonElement>(null);
	useClickOutside(
		wrapperRef,
		() => {
			setDisplayJoinGroupMenu(false);
		},
		additionalRef,
	);

	useEffect(() => {
		const getChannels = async () => {
			try {
				const channelList = await axios.get<channelType[]>("/api/Channel");
				dispatch({
					type: ACTION.SET_CHANNELS,
					payload: { channels: channelList.data },
				});
				changeLoading(false);
			} catch (error) {
				console.log(error);
			}
		};
		getChannels();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="side-bar">
			<div className="side-bar-header">
				<h2>Messaging</h2>
				<div className="join-group-container">
					<button
						className="join-group"
						onClick={() => setDisplayJoinGroupMenu(!displayJoinGroupMenu)}
						ref={additionalRef}
					>
						+
					</button>
					{displayJoinGroupMenu ? (
						<div className="join-group-menu popover" ref={wrapperRef}>
							<div className="triangle"></div>
							<Link
								to={"create-group"}
								className="create-group popover-item"
								onClick={(e) => {
									if (e) setDisplayJoinGroupMenu(false);
								}}
							>
								Create Group
							</Link>
						</div>
					) : undefined}
				</div>
			</div>
			<div className="channel-type-header">
				<button
					className={activeButton === "all" ? "active-btn" : "inactive-btn"}
					onClick={(e) => {
						setActiveButton(e.currentTarget.value as "all");
					}}
					value={"all"}
				>
					All
				</button>
				<button
					className={activeButton === "user" ? "active-btn" : "inactive-btn"}
					onClick={(e) => {
						setActiveButton(e.currentTarget.value as "user");
					}}
					value={"user"}
				>
					Direct
				</button>
				<button
					className={activeButton === "group" ? "active-btn" : "inactive-btn"}
					onClick={(e) => {
						setActiveButton(e.currentTarget.value as "group");
					}}
					value={"group"}
				>
					Groups
				</button>
			</div>
			<div className="channels">
				{!loading ? (
					<>
						{channelDispatch.length > 0
							? channelDispatch.map((channel) => {
									if (activeButton === "all") {
										return (
											<NavLink
												to={`${channel.type}/${channel.channelId}`}
												className="channel"
												key={channel.channelId}
											>
												{channel.type === "group" ? (
													`# ${channel.name}`
												) : (
													<ProfilePic
														url=""
														size="18"
														userName={channel.name}
													/>
												)}
											</NavLink>
										);
									}
									if (activeButton === channel.type) {
										return (
											<NavLink
												to={`${channel.type}/${channel.channelId}`}
												className="channel"
												key={channel.channelId}
											>
												{channel.type === "group" ? (
													`# ${channel.name}`
												) : (
													<ProfilePic
														url=""
														size="20"
														userName={channel.name}
													/>
												)}
											</NavLink>
										);
									}
								})
							: "No channels Found"}
					</>
				) : (
					<TailSpin
						height="40"
						width="40"
						color="white"
						ariaLabel="tail-spin-loading"
						wrapperClass="load-channel"
					/>
				)}
			</div>
		</div>
	);
}

export default SideBar;
