import { Service } from "typedi";

@Service()
export class MapService {
    private users = [{ id: 1, name: "John Doe" }];

    uploadJsonFile() {
        return this.users;
    }

    getConvertedTemprature(scale: number) {
        return this.users.find(user => user.id === scale);
    }
}
