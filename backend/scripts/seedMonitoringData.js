/**
 * Script untuk insert dummy data monitoring dengan nilai berbeda untuk setiap kolam
 * Untuk test perbedaan hasil ML prediction
 */

const db = require("../db");
require("dotenv").config();

async function seedMonitoringData() {
  try {
    console.log("=".repeat(60));
    console.log("🌊 Seeding Dummy Monitoring Data untuk Test ML");
    console.log("=".repeat(60));
    console.log();

    // Dummy data dengan variasi yang berbeda untuk setiap kolam
    const dummyData = [
      // Kolam 1: Kondisi BURUK - pH rendah, suhu tinggi, oksigen rendah
      {
        pond_id: 1,
        temperature: 34.0,
        ph_level: 5.5,
        dissolved_oxygen: 2.5,
        turbidity: 55.0,
        description: "Kondisi BURUK - pH asam, suhu tinggi, oksigen rendah",
      },
      {
        pond_id: 1,
        temperature: 33.5,
        ph_level: 5.8,
        dissolved_oxygen: 3.0,
        turbidity: 52.0,
        description: "Kondisi BURUK - Masih kritis",
      },
      {
        pond_id: 1,
        temperature: 32.0,
        ph_level: 6.0,
        dissolved_oxygen: 3.5,
        turbidity: 48.0,
        description: "Kondisi BURUK - Mulai membaik sedikit",
      },

      // Kolam 2: Kondisi NORMAL - Beberapa parameter di batas toleransi
      {
        pond_id: 2,
        temperature: 27.5,
        ph_level: 6.8,
        dissolved_oxygen: 4.8,
        turbidity: 28.0,
        description: "Kondisi NORMAL - Oksigen sedikit rendah",
      },
      {
        pond_id: 2,
        temperature: 26.0,
        ph_level: 7.0,
        dissolved_oxygen: 5.2,
        turbidity: 26.0,
        description: "Kondisi NORMAL - Parameter mendekati ideal",
      },
      {
        pond_id: 2,
        temperature: 28.5,
        ph_level: 6.9,
        dissolved_oxygen: 4.5,
        turbidity: 30.0,
        description: "Kondisi NORMAL - Kekeruhan agak tinggi",
      },

      // Kolam 3: Kondisi BAIK - Semua parameter optimal
      {
        pond_id: 3,
        temperature: 28.0,
        ph_level: 7.2,
        dissolved_oxygen: 6.5,
        turbidity: 15.0,
        description: "Kondisi BAIK - Optimal untuk budidaya",
      },
      {
        pond_id: 3,
        temperature: 27.0,
        ph_level: 7.5,
        dissolved_oxygen: 6.8,
        turbidity: 12.0,
        description: "Kondisi BAIK - Sangat optimal",
      },
      {
        pond_id: 3,
        temperature: 28.5,
        ph_level: 7.3,
        dissolved_oxygen: 7.0,
        turbidity: 18.0,
        description: "Kondisi BAIK - Parameter ideal",
      },

      // Tambahan variasi untuk kolam 1
      {
        pond_id: 1,
        temperature: 31.0,
        ph_level: 6.2,
        dissolved_oxygen: 4.0,
        turbidity: 45.0,
        description: "Kondisi masih perlu perhatian",
      },

      // Tambahan variasi untuk kolam 2
      {
        pond_id: 2,
        temperature: 26.5,
        ph_level: 7.1,
        dissolved_oxygen: 5.0,
        turbidity: 27.0,
        description: "Kondisi normal, monitor terus",
      },

      // Tambahan variasi untuk kolam 3
      {
        pond_id: 3,
        temperature: 27.5,
        ph_level: 7.4,
        dissolved_oxygen: 6.6,
        turbidity: 14.0,
        description: "Kondisi sangat baik",
      },
    ];

    console.log(`📝 Inserting ${dummyData.length} dummy monitoring data...`);
    console.log();

    let successCount = 0;
    let errorCount = 0;

    for (const data of dummyData) {
      try {
        // Insert dengan logged_at yang berbeda (spread dalam beberapa hari terakhir)
        const hoursAgo = Math.floor(Math.random() * 72); // 0-72 jam yang lalu
        const loggedAt = new Date();
        loggedAt.setHours(loggedAt.getHours() - hoursAgo);

        const result = await db.query(
          `INSERT INTO water_quality_logs 
           (pond_id, temperature, ph_level, dissolved_oxygen, turbidity, logged_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, pond_id, logged_at`,
          [
            data.pond_id,
            data.temperature,
            data.ph_level,
            data.dissolved_oxygen,
            data.turbidity,
            loggedAt,
          ]
        );

        successCount++;
        console.log(`✅ Kolam ${data.pond_id}: ${data.description}`);
        console.log(
          `   pH: ${data.ph_level}, Temp: ${data.temperature}°C, DO: ${data.dissolved_oxygen}, Turb: ${data.turbidity}`
        );
      } catch (error) {
        errorCount++;
        console.error(
          `❌ Error inserting data for pond ${data.pond_id}:`,
          error.message
        );
      }
    }

    console.log();
    console.log("=".repeat(60));
    console.log("✅ Seeding Complete!");
    console.log(`   Success: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log("=".repeat(60));
    console.log();

    // Show summary by pond
    console.log("📊 Summary by Pond:");
    for (let pondId = 1; pondId <= 3; pondId++) {
      const count = await db.query(
        "SELECT COUNT(*) as count FROM water_quality_logs WHERE pond_id = $1",
        [pondId]
      );
      console.log(`   Kolam ${pondId}: ${count.rows[0].count} data`);
    }

    console.log();
    console.log("💡 Next Steps:");
    console.log(
      "   1. Restart ML Service untuk memastikan perubahan kode berlaku"
    );
    console.log("   2. Akses halaman Admin -> Monitoring Kualitas Air");
    console.log(
      "   3. Pilih kolam 1, 2, dan 3 untuk melihat perbedaan hasil ML"
    );
    console.log();
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error);
    process.exit(1);
  } finally {
    // Close database connection
    await db.pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  seedMonitoringData()
    .then(() => {
      console.log("✅ Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Script failed:", error);
      process.exit(1);
    });
}

module.exports = { seedMonitoringData };


