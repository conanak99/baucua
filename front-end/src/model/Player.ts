class Player {
  id: string;
  name: string;
  avatar: string;
  point: number;

  constructor(id: string, name: string, avatar: string) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this.point = 20;
  }
}

export default Player;
