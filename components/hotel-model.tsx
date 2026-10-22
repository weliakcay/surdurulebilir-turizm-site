"use client";
import { useEffect, useRef, useState } from "react";
const departments = [
  {
    name: "Mutfak",
    color: "#26a88a",
    point: "Soğuk oda · Üretim alanı",
    text: "Sıcaklık ve ekipman kontrol formlarını ilgili noktalarda topla.",
  },
  {
    name: "Havuz",
    color: "#438dda",
    point: "Havuz · Teknik alan",
    text: "Su kontrolü ve bakım formlarını aynı noktanın geçmişinde düzenle.",
  },
  {
    name: "Kat hizmetleri",
    color: "#e7ad3f",
    point: "Katlar · Ortak alanlar",
    text: "Temizlik ve vardiya kontrol kayıtlarını doğru alana bağla.",
  },
];
export function HotelModel() {
  const mount = useRef<HTMLDivElement>(null);
  const select = useRef<(n: number) => void>(() => {});
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState("3 boyutlu görünüm yükleniyor…");
  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};
    const host = mount.current!;
    const observer = new IntersectionObserver(
      async (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        try {
          const THREE = await import("three");
          const { OrbitControls } =
            await import("three/addons/controls/OrbitControls.js");
          if (cancelled) return;
          const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
          });
          renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
          host.appendChild(renderer.domElement);
          renderer.domElement.setAttribute(
            "aria-label",
            "Departmanları renklerle ayrılmış kavramsal otel modeli. Döndürmek için sürükleyin.",
          );
          renderer.domElement.setAttribute("role", "img");
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
          camera.position.set(10, 8, 11);
          const controls = new OrbitControls(camera, renderer.domElement);
          controls.enableZoom = false;
          controls.enablePan = false;
          controls.minPolarAngle = 0.3;
          controls.maxPolarAngle = Math.PI / 2.2;
          controls.target.set(0, 1.7, 0);
          controls.update();
          scene.add(new THREE.HemisphereLight(0xffffff, 0x688b94, 3));
          const light = new THREE.DirectionalLight(0xffffff, 3);
          light.position.set(5, 10, 8);
          scene.add(light);
          const group = new THREE.Group();
          scene.add(group);
          const floors: InstanceType<typeof THREE.Mesh>[] = [];
          const geometries: InstanceType<typeof THREE.BufferGeometry>[] = [];
          const materials: InstanceType<typeof THREE.Material>[] = [];
          function box(
            w: number,
            h: number,
            d: number,
            x: number,
            y: number,
            z: number,
            color: string,
          ) {
            const geo = new THREE.BoxGeometry(w, h, d);
            const mat = new THREE.MeshStandardMaterial({
              color,
              roughness: 0.55,
              metalness: 0.05,
            });
            geometries.push(geo);
            materials.push(mat);
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(x, y, z);
            group.add(mesh);
            return mesh;
          }
          box(8, 0.18, 5.8, 0, -0.15, 0, "#c8dfda");
          for (let floor = 0; floor < 3; floor++) {
            const y = floor * 1.45;
            const slab = box(6.3, 0.18, 4, 0, y, 0, departments[floor].color);
            floors.push(slab);
            box(6.3, 1.15, 0.12, 0, y + 0.65, -1.95, "#f5f7ef");
            box(0.12, 1.15, 4, -3.1, y + 0.65, 0, "#e7eee6");
            for (let j = 0; j < 3; j++) {
              box(
                0.9,
                0.55,
                0.8,
                -1.9 + j * 1.9,
                y + 0.4,
                -0.8,
                departments[floor].color,
              );
              const geo = new THREE.SphereGeometry(0.13, 12, 10);
              const mat = new THREE.MeshStandardMaterial({
                color: departments[floor].color,
                emissive: departments[floor].color,
                emissiveIntensity: 0.3,
              });
              geometries.push(geo);
              materials.push(mat);
              const dot = new THREE.Mesh(geo, mat);
              dot.position.set(-1.9 + j * 1.9, y + 0.65, 0.8);
              group.add(dot);
            }
          }
          box(6.7, 0.15, 4.3, 0, 4.2, 0, "#244f48");
          const draw = () => renderer.render(scene, camera);
          select.current = (n) => {
            floors.forEach((mesh, i) => {
              mesh.scale.set(i === n ? 1.06 : 1, 1, i === n ? 1.06 : 1);
            });
            draw();
          };
          const resize = () => {
            const w = host.clientWidth,
              h = host.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            draw();
          };
          const ro = new ResizeObserver(resize);
          ro.observe(host);
          controls.addEventListener("change", draw);
          const click = (event: PointerEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            const pointer = new THREE.Vector2(
              ((event.clientX - rect.left) / rect.width) * 2 - 1,
              (-(event.clientY - rect.top) / rect.height) * 2 + 1,
            );
            const ray = new THREE.Raycaster();
            ray.setFromCamera(pointer, camera);
            const hit = ray.intersectObjects(floors)[0];
            if (hit) {
              const i = floors.indexOf(hit.object as (typeof floors)[number]);
              setActive(i);
              select.current(i);
            }
          };
          renderer.domElement.addEventListener("click", click);
          resize();
          setStatus("Sürükleyerek döndür · Departmanı düğmelerden seç");
          cleanup = () => {
            ro.disconnect();
            controls.dispose();
            renderer.domElement.removeEventListener("click", click);
            geometries.forEach((g) => g.dispose());
            materials.forEach((m) => m.dispose());
            renderer.dispose();
            renderer.domElement.remove();
            select.current = () => {};
          };
        } catch {
          if (!cancelled)
            setStatus(
              "3 boyutlu görünüm bu cihazda açılamadı. Departmanları düğmelerle keşfedebilirsin.",
            );
        }
      },
      { rootMargin: "150px" },
    );
    observer.observe(host);
    return () => {
      cancelled = true;
      observer.disconnect();
      cleanup();
    };
  }, []);
  return (
    <section className="section hotel-section">
      <div className="wrap hotel-layout">
        <div>
          <p className="demo-label">Aynı otel. Birbirine bağlı kayıtlar.</p>
          <h2>Her departmanın kendi kontrol noktası var.</h2>
          <p>
            Bir oteli tek bir form olarak düşünme. Departman, kontrol noktası ve
            o noktaya bağlı formlar birlikte bir operasyon düzeni oluşturur.
          </p>
          <div className="department-controls" aria-label="Departman seç">
            {departments.map((d, i) => (
              <button
                key={d.name}
                aria-pressed={active === i}
                onClick={() => {
                  setActive(i);
                  select.current(i);
                }}
              >
                <span style={{ background: d.color }} />
                {d.name}
              </button>
            ))}
          </div>
          <div className="department-detail" aria-live="polite">
            <h3>{departments[active].point}</h3>
            <p>{departments[active].text}</p>
          </div>
        </div>
        <div>
          <div className="hotel-canvas" ref={mount} />
          <p className="tiny">{status}</p>
          <p className="tiny">
            Kavramsal 3B anlatım. Greenlog içinde bir bina planı veya konum
            takip ekranı değildir.
          </p>
        </div>
      </div>
    </section>
  );
}
