import {
	Children,
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from "react";
import gsap from "gsap";
import { Subject } from "rxjs";
import styles from "./book-hover.module.css";

type BookProps = {
	idx: number;
	title: string;
	thumbnail: string;
};

const config = {
	offsetY: 42,
	threshold: 100,
	in: "power4.in",
	out: "power2.out",
	distance: 30,
	rotate: -5,
	focusColor: "red",
};

const eases = {
	in: gsap.parseEase(config.in),
	out: gsap.parseEase(config.out),
};

const getPower = gsap.utils.pipe(
	({ distance, width }: { distance: number; width: number }) => {
		const clamped = gsap.utils.clamp(
			-config.threshold,
			config.threshold,
			distance
		);
		return { clamped, width };
	},
	({ clamped, width }: { clamped: number; width: number }) => {
		const mapped = gsap.utils.mapRange(
			-config.threshold,
			config.threshold,
			-1,
			1
		)(clamped);
		return { mapped, active: Math.abs(clamped) <= width * 0.4 };
	},
	({ mapped, active }: { mapped: number; active: boolean }) => {
		const offset = active ? 0 : 0;
		return mapped > 0
			? 1 - eases.in(mapped) - offset
			: 1 - eases.out(Math.abs(mapped)) - offset;
	}
);

export const Book = ({ idx, title, thumbnail }: BookProps) => {
	const eventObservable = useContext(BookGroupContext);
	const domRef = useRef<HTMLLIElement>(null);

	if (!eventObservable) {
		throw new Error("Book must be used within a BookGroup");
	}

	useEffect(() => {
		const subscription = eventObservable.subscribe((payload) => {
			if (!domRef.current) {
				console.warn("domRef is not found");
				return;
			}

			switch (payload.type) {
				case "move":
				case "focus":
					const clientX =
						"clientX" in payload.event
							? payload.event.clientX
							: payload.event.target.getBoundingClientRect().left;
					const { left, width } = domRef.current.getBoundingClientRect();
					const distance = clientX - left;
					const power = getPower({ distance, width });
					domRef.current.style.setProperty("--power", power.toString());
					break;
				case "leave":
					domRef.current.style.setProperty("--power", "0");
					break;
				case "blur":
					domRef.current.style.setProperty("--power", "0");
					break;
			}
		});

		return () => {
			if (!subscription.closed) {
				subscription.unsubscribe();
			}
		};
	}, [eventObservable]);

	return (
		<li
			style={{
				"--idx": idx,
			}}
			ref={domRef}
			className={styles.list}
		>
			<button
				onMouseDown={(e) => {
					// 버튼 클릭 시 focus 가 부모로 전파되어 focus 이벤트가 실행되는걸 막는다.
					e.preventDefault();
				}}
			>
				<img src={thumbnail} alt={title} />
			</button>
		</li>
	);
};

type BookGroupProps = {
	className?: string;
	children: React.ReactNode;
};

type EventPayload =
	| {
			type: "move";
			event: PointerEvent;
	  }
	| {
			type: "leave";
	  }
	| {
			type: "focus";
			event: FocusEvent;
	  }
	| {
			type: "blur";
	  };

const BookGroupContext = createContext<Subject<EventPayload> | null>(null);

export const BookGroup = ({ children, className }: BookGroupProps) => {
	const childrenCount = Children.toArray(children).length;
	const eventObservable = useMemo(() => new Subject<EventPayload>(), []);

	return (
		<BookGroupContext.Provider value={eventObservable}>
			<div className={cn(className, styles.container)}>
				<ul
					onFocusCapture={(e) => {
						console.log(e);
						eventObservable.next({
							type: "focus",
							event: e,
						});
					}}
					onBlurCapture={() => {
						eventObservable.next({
							type: "blur",
						});
					}}
					onPointerMove={(e) => {
						eventObservable.next({
							type: "move",
							event: e,
						});
					}}
					onPointerLeave={() => {
						eventObservable.next({
							type: "leave",
						});
					}}
					style={{
						"--book-count": childrenCount,
						"--offset-y": config.offsetY,
						"--distance": config.distance,
						"--rotate": config.rotate,
						"--focus-color": config.focusColor,
					}}
					className={styles.bookContainer}
				>
					{children}
				</ul>
			</div>
		</BookGroupContext.Provider>
	);
};

interface Book {
	id: string;
	title: string;
	author: string;
	coverImage: string;
	review: string;
	rating: number;
	readAt: string;
}
