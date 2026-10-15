import { GroupCard } from "@/components/site/group-card"
import { getClasses, getGroupSummaries } from "@/lib/data"

/** Semua kelompok dalam satu grid seperti deretan artikel majalah; label kartu = kelas. */
export async function Gallery() {
  const [classes, groups] = await Promise.all([getClasses(), getGroupSummaries()])
  if (groups.length === 0) {
    return (
      <p className="brutal p-8 text-center font-semibold">
        {classes.length === 0
          ? "Belum ada kelas. Guru dapat menambahkan kelas dari dashboard."
          : "Belum ada kelompok. Guru dapat menambahkan kelompok dari dashboard."}
      </p>
    )
  }

  // Warna label tetap per kelas (urutan kelas), bukan per kartu.
  const classIndex = new Map(classes.map((c, i) => [c.id, i]))

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {groups.map((g) => (
        <GroupCard key={g.id} group={g} colorIndex={classIndex.get(g.class_id) ?? 0} />
      ))}
    </div>
  )
}
