import * as THREE from "three";
import { details } from "./type/StateType";
import { getExn, isNullable, isStrictNullable } from "./utils/NullableUtils";
import { Capsule } from "./three/Capsule";

class Octree {
	public box: THREE.Box3
	public actualBox: THREE.Box3

	public capacity
	public divided

	public transforms
	public boxes
	public names

	public children
	public depth

	public details: details = null

	constructor(box3, n, depth) {
		this.box = box3;
		this.actualBox = box3;


		this.capacity = n;
		this.divided = false;

		this.transforms = [];
		this.boxes = [];
		this.names = [];

		this.children = [];
		this.depth = depth;
	}

	subdivide() {
		const { box, capacity, depth } = this;
		let size = new THREE.Vector3().subVectors(box.max, box.min).divideScalar(2);
		let arr = [
			[0, 0, 0],
			[size.x, 0, 0],
			[0, 0, size.z],
			[size.x, 0, size.z],
			[0, size.y, 0],
			[size.x, size.y, 0],
			[0, size.y, size.z],
			[size.x, size.y, size.z],
		];
		for (let i = 0; i < 8; i++) {
			let min = new THREE.Vector3(
				box.min.x + arr[i][0],
				box.min.y + arr[i][1],
				box.min.z + arr[i][2]
			);
			let max = new THREE.Vector3().addVectors(min, size);
			let newbox = new THREE.Box3(min, max);
			this.children.push(new Octree(newbox, capacity, depth + 1));
		}
		this.divided = true;
	}

	insert(transform, box_, name) {
		const { box, transforms, boxes, names, capacity, divided, children } = this;
		if (
			// !box.containsPoint(new THREE.Vector3().setFromMatrixPosition(transform))
			!box.intersectsBox(box_)
			// !box.containsBox(box_)
		) {
			return false;
		}

		this.actualBox = this.actualBox.union(box_)

		if (transforms.length < capacity) {
			transforms.push(transform);
			boxes.push(box_);
			names.push(name);

			return true;
		} else {
			if (!divided) this.subdivide();
			for (let i = 0; i < children.length; i++) {
				if (children[i].insert(transform, box_, name)) return true;
			}
		}
	}

	// queryByBox(boxRange, found = []) {
	// 	if (!this.box.intersectsBox(boxRange)) {
	// 		return found;
	// 	} else {
	// 		for (let transform of this.transforms) {
	// 			if (
	// 				boxRange.containsPoint(
	// 					new THREE.Vector3().setFromMatrixPosition(transform)
	// 				)
	// 			) {
	// 				found.push(transform);
	// 			}
	// 		}
	// 		if (this.divided) {
	// 			this.children.forEach((child) => {
	// 				child.queryByBox(boxRange, found);
	// 			});
	// 		}
	// 		return found;
	// 	}
	// }

	// queryBySphere(
	// 	sphereRange,
	// 	boundingBox = sphereRange.getBoundingBox(new THREE.Box3()),
	// 	found = []
	// ) {
	// 	if (!this.box.intersectsBox(boundingBox)) {
	// 		return found;
	// 	} else {
	// 		for (let transform of this.transforms) {
	// 			if (
	// 				sphereRange.containsPoint(
	// 					new THREE.Vector3().setFromMatrixPosition(transform)
	// 				)
	// 			) {
	// 				found.push(transform);
	// 			}
	// 		}
	// 		if (this.divided) {
	// 			this.children.forEach((child) => {
	// 				child.queryBySphere(sphereRange, boundingBox, found);
	// 			});
	// 		}
	// 		return found;
	// 	}
	// }

	// queryByFrustum(frustum: THREE.Frustum, totalFound = [], levelFound = [], childIndex = 0) {
	queryByFrustum(frustum: THREE.Frustum, transformFound = [], boxFound = [], nameFound = []) {
		// if (!frustum.intersectsBox(this.box)) {
		if (!frustum.intersectsBox(this.actualBox)) {
			// return found;
			return [transformFound, boxFound, nameFound]
		} else {
			// for (let transform of this.transforms) {
			// 	if (
			// 		frustum.containsPoint(
			// 			new THREE.Vector3().setFromMatrixPosition(transform)
			// 		)
			// 	) {
			// 		found.push(transform);
			// 	}
			// }

			let self = this

			this.boxes.forEach((box, i) => {
				if (
					frustum.intersectsBox(
						box
					)
				) {
					transformFound.push(self.transforms[i])
					boxFound.push(box)
					nameFound.push(self.names[i])
				}
			})

			if (this.divided) {
				this.children.forEach(child => {
					child.queryByFrustum(frustum, transformFound, boxFound, nameFound);
				});
			}

			// totalFound.push([childIndex, levelFound])

			// return totalFound

			return [transformFound, boxFound, nameFound]
		}
	}


	// queryByRay(ray: THREE.Ray, transformFound = [], boxFound = [], nameFound = [], results = []) {
	// 	// if (ray.direction.length() === 0) return;


	// 	if (!ray.intersectsBox(this.box)) {
	// 		return [transformFound, boxFound, nameFound]
	// 	} else {
	// 		let self = this

	// 		this.boxes.forEach((box, i) => {
	// 			let result = ray.intersectBox(box, new THREE.Vector3())

	// 			if (!isStrictNullable(result)) {
	// 				transformFound.push(self.transforms[i])
	// 				boxFound.push(box)
	// 				nameFound.push(self.names[i])
	// 				results.push(getExn(result))
	// 			}
	// 		})

	// 		if (this.divided) {
	// 			this.children.forEach(child => {
	// 				child.queryByFrustum(ray, transformFound, boxFound, nameFound, results);
	// 			});
	// 		}

	// 		return [transformFound, boxFound, nameFound, results]
	// 	}
	// }
	queryByRay(ray: THREE.Ray, distance = Infinity, transform = null, box = null, name = null) {
		// if (ray.direction.length() === 0) return;

		// if (!ray.intersectsBox(this.box)) {
		if (!ray.intersectsBox(this.actualBox)) {
			return [distance, transform, box, name]
		} else {
			let self = this

			let data = this.boxes.reduce(([distance, transform, box, name], box_, i) => {
				let result = ray.intersectBox(box_, new THREE.Vector3())

				if (!isStrictNullable(result)) {
					let newDistance = getExn(result).sub(ray.origin).length()

					if (distance > newDistance) {
						return [newDistance, self.transforms[i], self.boxes[i], self.names[i]]
					}
				}

				return [distance, transform, box, name]
			}, [distance, transform, box, name])

			if (this.divided) {
				return this.children.reduce((data, child) => {
					return child.queryByRay(ray, data[0], data[1], data[2], data[3]);
				}, data);
			}

			return data
		}
	}


	// queryByCapsule(capsule: Capsule, transform = null, box = null, name = null) {
	// 	if (!capsule.intersectsBox(this.box)) {
	// 		return [transform, box, name]
	// 	} else {
	// 		let self = this

	// 		let data = this.boxes.reduce(([transform, box, name], box_, i) => {
	// 			if (transform !== null) {
	// 				return [transform, box, name]
	// 			}

	// 			if (capsule.intersectsBox(box_)) {
	// 				return [self.transforms[i], self.boxes[i], self.names[i]]
	// 			}

	// 			return [transform, box, name]
	// 		}, [transform, box, name])

	// 		if (transform === null && this.divided) {
	// 			return this.children.reduce((data, child) => {
	// 				if (data[0] !== null) {
	// 					return data
	// 				}

	// 				return child.queryByCapsule(capsule, data[0], data[1], data[2])
	// 			}, data);
	// 		}

	// 		return data
	// 	}
	// }
	queryByCapsule(capsule: Capsule, result = null, transform = null, box = null, name = null) {
		// if (!capsule.intersectsBox(this.box)) {
		if (!capsule.intersectsBox(this.actualBox)) {
			return [result, transform, box, name]
		} else {
			let self = this

			let data = this.boxes.reduce(([result, transform, box, name], box_, i) => {
				if (result !== null) {
					return [result, transform, box, name]
				}

				if (capsule.intersectsBox(box_)) {
					// TODO compute normal vector to box3's plane?
					let collisionVector = capsule.getCenter(new THREE.Vector3()).sub(box_.getCenter(new THREE.Vector3()));

					let depth = collisionVector.length();


					return [{ normal: collisionVector.normalize(), depth: depth }, self.transforms[i], self.boxes[i], self.names[i]]
				}

				return [result, transform, box, name]
			}, [result, transform, box, name])

			if (result === null && this.divided) {
				return this.children.reduce((data, child) => {
					if (data[0] !== null) {
						return data
					}

					return child.queryByCapsule(capsule, data[0], data[1], data[2], data[3])
				}, data);
			}

			return data
		}
	}

	display(scene) {
		// 叶子结点
		if (!this.divided && this.transforms.length > 0) {
			scene.add(new THREE.Box3Helper(this.box, 0x00ff00));
			return;
		}
		this.children.forEach((child) => {
			child.display(scene);
		});
	}

	// getTransforms(totalFound) {
	// 	totalFound.reduce((result, [childIndex, levelFound]) => {

	// 	}, [])

	// 	// return this.transforms[index]
	// }

	// getBox(index) {
	// 	return this.boxes[index]
	// }

	// getName(index) {
	// 	return this.names[index]
	// }

	computeBox() {
		return new THREE.Box3().setFromObject(this.details[0].group)
	}
}

export { Octree };
