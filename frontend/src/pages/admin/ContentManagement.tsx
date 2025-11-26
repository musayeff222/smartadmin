import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface SiteContent {
  id: string;
  key: string;
  content: string;
  type: string;
}

const ContentManagement = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContent, setEditingContent] = useState<SiteContent | null>(null);
  const [formData, setFormData] = useState({
    key: '',
    content: '',
    type: 'text',
  });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await api.get('/admin/contents');
      setContents(response.data.contents);
    } catch (error) {
      toast.error('İçerikler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContent) {
        await api.put(`/admin/contents/${editingContent.id}`, formData);
        toast.success('İçerik güncellendi');
      } else {
        await api.post('/admin/contents', formData);
        toast.success('İçerik oluşturuldu');
      }
      setShowModal(false);
      setEditingContent(null);
      resetForm();
      fetchContents();
    } catch (error) {
      toast.error('İşlem başarısız');
    }
  };

  const handleEdit = (content: SiteContent) => {
    setEditingContent(content);
    setFormData({
      key: content.key,
      content: content.content,
      type: content.type,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      key: '',
      content: '',
      type: 'text',
    });
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">İçerik Yönetimi</h1>
        <button
          onClick={() => {
            resetForm();
            setEditingContent(null);
            setShowModal(true);
          }}
          className="btn btn-primary"
        >
          Yeni İçerik Ekle
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Anahtar</th>
              <th className="text-left p-4">İçerik</th>
              <th className="text-left p-4">Tip</th>
              <th className="text-right p-4">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {contents.map((content) => (
              <tr key={content.id} className="border-b">
                <td className="p-4 font-mono text-sm">{content.key}</td>
                <td className="p-4">
                  {content.content.length > 50
                    ? content.content.substring(0, 50) + '...'
                    : content.content}
                </td>
                <td className="p-4">{content.type}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleEdit(content)}
                    className="text-primary-600 hover:underline"
                  >
                    Düzenle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {contents.length === 0 && (
          <div className="text-center py-8 text-gray-500">Henüz içerik bulunmamaktadır.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">
              {editingContent ? 'İçerik Düzenle' : 'Yeni İçerik Ekle'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Anahtar</label>
                <input
                  type="text"
                  required
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  className="input"
                  placeholder="örn: homepage_hero_title"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Tip</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input"
                >
                  <option value="text">Metin</option>
                  <option value="html">HTML</option>
                  <option value="image_url">Resim URL</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">İçerik</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="input"
                  rows={8}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingContent(null);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  İptal
                </button>
                <button type="submit" className="btn btn-primary">
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;

