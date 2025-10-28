'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { formatEther } from 'viem';
import styles from './Tournaments.module.css';

const LEADERBOARD_ABI = [
  {
    inputs: [],
    name: 'getActiveTournaments',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '', type: 'uint256' }],
    name: 'tournaments',
    outputs: [
      { name: 'id', type: 'uint256' },
      { name: 'name', type: 'string' },
      { name: 'entryFee', type: 'uint256' },
      { name: 'prizePool', type: 'uint256' },
      { name: 'maxParticipants', type: 'uint256' },
      { name: 'currentParticipants', type: 'uint256' },
      { name: 'startTime', type: 'uint256' },
      { name: 'endTime', type: 'uint256' },
      { name: 'status', type: 'uint8' },
      { name: 'winner', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: '_tournamentId', type: 'uint256' }],
    name: 'joinTournament',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: '_player', type: 'address' }],
    name: 'getPlayerTournaments',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

interface Tournament {
  id: bigint;
  name: string;
  entryFee: bigint;
  prizePool: bigint;
  maxParticipants: bigint;
  currentParticipants: bigint;
  startTime: bigint;
  endTime: bigint;
  status: number;
  winner: string;
}

function TournamentCard({ tournament }: { tournament: Tournament }) {
  const { address: _address } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const statusText = {
    0: 'Aktif',
    1: 'Tamamlandı',
    2: 'İptal Edildi'
  };

  const statusColor = {
    0: '#4CAF50',
    1: '#2196F3',
    2: '#f44336'
  };

  const canJoin = tournament.status === 0 &&
                  tournament.currentParticipants < tournament.maxParticipants &&
                  Date.now() / 1000 < Number(tournament.startTime);

  const handleJoin = () => {
    if (!canJoin) return;

    writeContract({
      address: process.env.NEXT_PUBLIC_GAME_CONTRACT as `0x${string}`,
      abi: LEADERBOARD_ABI,
      functionName: 'joinTournament',
      args: [tournament.id],
      value: tournament.entryFee,
    });
  };

  return (
    <div className={styles.tournamentCard}>
      <div className={styles.header}>
        <h3>{tournament.name}</h3>
        <span
          className={styles.status}
          style={{ backgroundColor: statusColor[tournament.status as keyof typeof statusColor] }}
        >
          {statusText[tournament.status as keyof typeof statusText]}
        </span>
      </div>

      <div className={styles.details}>
        <div className={styles.detail}>
          <span className={styles.label}>Katılım Ücreti:</span>
          <span className={styles.value}>{formatEther(tournament.entryFee)} ETH</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.label}>Ödül Havuzu:</span>
          <span className={styles.value}>{formatEther(tournament.prizePool)} ETH</span>
        </div>
        <div className={styles.detail}>
          <span className={styles.label}>Katılımcılar:</span>
          <span className={styles.value}>
            {Number(tournament.currentParticipants)} / {Number(tournament.maxParticipants)}
          </span>
        </div>
        <div className={styles.detail}>
          <span className={styles.label}>Bitiş:</span>
          <span className={styles.value}>
            {new Date(Number(tournament.endTime) * 1000).toLocaleDateString('tr-TR')}
          </span>
        </div>
      </div>

      {canJoin && (
        <button
          className={styles.joinButton}
          onClick={handleJoin}
          disabled={isPending}
        >
          {isPending ? 'Katılıyor...' : 'Turnuvaya Katıl'}
        </button>
      )}

      {tournament.status === 1 && tournament.winner && (
        <div className={styles.winner}>
          <span className={styles.trophy}>🏆</span>
          Kazanan: {tournament.winner.slice(0, 6)}...{tournament.winner.slice(-4)}
        </div>
      )}
    </div>
  );
}

export default function Tournaments() {
  const { address } = useAccount();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [myTournaments, setMyTournaments] = useState<bigint[]>([]);

  const { data: activeTournamentIds } = useReadContract({
    address: process.env.NEXT_PUBLIC_GAME_CONTRACT as `0x${string}`,
    abi: LEADERBOARD_ABI,
    functionName: 'getActiveTournaments',
  });

  const { data: playerTournamentIds } = useReadContract({
    address: process.env.NEXT_PUBLIC_GAME_CONTRACT as `0x${string}`,
    abi: LEADERBOARD_ABI,
    functionName: 'getPlayerTournaments',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (playerTournamentIds) {
      setMyTournaments(playerTournamentIds as bigint[]);
    }
  }, [playerTournamentIds]);

  // Create individual hooks for each tournament
  const tournamentHooks = activeTournamentIds?.map((id: bigint) =>
    useReadContract({
      address: process.env.NEXT_PUBLIC_GAME_CONTRACT as `0x${string}`,
      abi: LEADERBOARD_ABI,
      functionName: 'tournaments',
      args: [id],
      query: {
        enabled: !!activeTournamentIds,
      },
    })
  ) || [];

  useEffect(() => {
    if (tournamentHooks.length > 0) {
      const tournamentData = tournamentHooks
        .map((hook: any) => hook.data)
        .filter(Boolean)
        .map((data: any) => data as Tournament);
      setTournaments(tournamentData);
    } else {
      setTournaments([]);
    }
  }, [tournamentHooks]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>🏆 Turnuvalar</h2>
        <p>Yüksek skorlar için turnuvalara katıl ve büyük ödüller kazan!</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{tournaments.length}</span>
          <span className={styles.statLabel}>Aktif Turnuva</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{myTournaments.length}</span>
          <span className={styles.statLabel}>Katıldığım</span>
        </div>
      </div>

      <div className={styles.tournamentsGrid}>
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <TournamentCard key={tournament.id.toString()} tournament={tournament} />
          ))
        ) : (
          <div className={styles.noTournaments}>
            <p>Şu anda aktif turnuva bulunmuyor.</p>
            <p>Yakında yeni turnuvalar başlayacak!</p>
          </div>
        )}
      </div>
    </div>
  );
}