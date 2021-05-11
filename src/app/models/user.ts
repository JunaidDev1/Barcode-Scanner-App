export class iUser {
    uid: string;
    fullName: string;
    email: string;
    numberOfScans: number;
    totalPoints: number;
    lastScanTimestamp: number;
    timestamp: number;
    bio: string;
    profileUrl: string;
}

export class iScan {
    uid: string;
    timestamp: number;
    points: number;
    scanItem: string;
}

export class iLeaderboard {
    user: iUser;
    numberOfScans: number;
    totalPoints: number;
}