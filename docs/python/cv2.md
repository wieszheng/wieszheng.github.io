# opencv

---

### 1. **基本用法**

```python
import cv2
import numpy as np

def show(img):
    ''' 显示一个图片 '''
    cv2.imshow('image', img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def imread(filename):
    ''' 
    Like cv2.imread
    This function will make sure filename exists 
    '''
    im = cv2.imread(filename)
    if im is None:
        raise RuntimeError("file: '%s' not exists" % filename)
    return im

def find_template(im_source, im_search, threshold=0.5, rgb=False, bgremove=False):
    '''
    @return find location
    if not found; return None
    '''
    result = find_all_template(im_source, im_search, threshold, 1, rgb, bgremove)
    return result[0] if result else None

def find_all_template(im_source, im_search, threshold=0.5, maxcnt=0, rgb=False, bgremove=False):
    '''
    Locate image position with cv2.templateFind

    Use pixel match to find pictures.

    Args:
        im_source(string): 图像、素材
        im_search(string): 需要查找的图片
        threshold: 阈值，当相识度小于该阈值的时候，就忽略掉

    Returns:
        A tuple of found [(point, score), ...]

    Raises:
        IOError: when file read error
    '''
    # method = cv2.TM_CCORR_NORMED
    # method = cv2.TM_SQDIFF_NORMED
    method = cv2.TM_CCOEFF_NORMED

    if rgb:
        s_bgr = cv2.split(im_search) # Blue Green Red
        i_bgr = cv2.split(im_source)
        weight = (0.3, 0.3, 0.4)
        resbgr = [0, 0, 0]
        for i in range(3): # bgr
            resbgr[i] = cv2.matchTemplate(i_bgr[i], s_bgr[i], method)
        res = resbgr[0]*weight[0] + resbgr[1]*weight[1] + resbgr[2]*weight[2]
    else:
        s_gray = cv2.cvtColor(im_search, cv2.COLOR_BGR2GRAY)
        i_gray = cv2.cvtColor(im_source, cv2.COLOR_BGR2GRAY)
        # 边界提取(来实现背景去除的功能)
        if bgremove:
            s_gray = cv2.Canny(s_gray, 100, 200)
            i_gray = cv2.Canny(i_gray, 100, 200)

        res = cv2.matchTemplate(i_gray, s_gray, method)
    w, h = im_search.shape[1], im_search.shape[0]

    result = []
    while True:
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
        if method in [cv2.TM_SQDIFF, cv2.TM_SQDIFF_NORMED]:
            top_left = min_loc
        else:
            top_left = max_loc
        if DEBUG: 
            print('templmatch_value(thresh:%.1f) = %.3f' %(threshold, max_val)) # not show debug
        if max_val < threshold:
            break
        # calculator middle point
        middle_point = (top_left[0]+w/2, top_left[1]+h/2)
        result.append(dict(
            result=middle_point,
            rectangle=(top_left, (top_left[0], top_left[1] + h), (top_left[0] + w, top_left[1]), (top_left[0] + w, top_left[1] + h)),
            confidence=max_val
        ))
        if maxcnt and len(result) >= maxcnt:
            break
        # floodfill the already found area
        cv2.floodFill(res, None, max_loc, (-1000,), max_val-threshold+0.1, 1, flags=cv2.FLOODFILL_FIXED_RANGE)
    return result


def _sift_instance(edge_threshold=100):
    if hasattr(cv2, 'SIFT'):
        return cv2.SIFT(edgeThreshold=edge_threshold)
    return cv2.xfeatures2d.SIFT_create(edgeThreshold=edge_threshold)


def sift_count(img):
    sift = _sift_instance()
    kp, des = sift.detectAndCompute(img, None)
    return len(kp)

def find_sift(im_source, im_search, min_match_count=4):
    '''
    SIFT特征点匹配
    '''
    res = find_all_sift(im_source, im_search, min_match_count, maxcnt=1)
    if not res:
        return None
    return res[0]
    

FLANN_INDEX_KDTREE = 0

def find_all_sift(im_source, im_search, min_match_count=4, maxcnt=0):
    '''
    使用sift算法进行多个相同元素的查找
    Args:
        im_source(string): 图像、素材
        im_search(string): 需要查找的图片
        threshold: 阈值，当相识度小于该阈值的时候，就忽略掉
        maxcnt: 限制匹配的数量

    Returns:
        A tuple of found [(point, rectangle), ...]
        A tuple of found [{"point": point, "rectangle": rectangle, "confidence": 0.76}, ...]
        rectangle is a 4 points list
    '''
    sift = _sift_instance()
    flann = cv2.FlannBasedMatcher({'algorithm': FLANN_INDEX_KDTREE, 'trees': 5}, dict(checks=50))

    kp_sch, des_sch = sift.detectAndCompute(im_search, None)
    if len(kp_sch) < min_match_count:
        return None

    kp_src, des_src = sift.detectAndCompute(im_source, None)
    if len(kp_src) < min_match_count:
        return None

    h, w = im_search.shape[1:]

    result = []
    while True:
        # 匹配两个图片中的特征点，k=2表示每个特征点取2个最匹配的点
        matches = flann.knnMatch(des_sch, des_src, k=2)
        good = []
        for m, n in matches:
            # 剔除掉跟第二匹配太接近的特征点
            if m.distance < 0.9 * n.distance:
                good.append(m)

        if len(good) < min_match_count:
            break

        sch_pts = np.float32([kp_sch[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)
        img_pts = np.float32([kp_src[m.trainIdx].pt for m in good]).reshape(-1, 1, 2) 

        # M是转化矩阵
        M, mask = cv2.findHomography(sch_pts, img_pts, cv2.RANSAC, 5.0)
        matches_mask = mask.ravel().tolist()

        # 计算四个角矩阵变换后的坐标，也就是在大图中的坐标
        h, w = im_search.shape[:2]
        pts = np.float32([[0, 0], [0, h-1], [w-1, h-1], [w-1, 0]]).reshape(-1, 1, 2)
        dst = cv2.perspectiveTransform(pts, M)

        # trans numpy arrary to python list
        # [(a, b), (a1, b1), ...]
        pypts = []
        for npt in dst.astype(int).tolist():
            pypts.append(tuple(npt[0]))

        lt, br = pypts[0], pypts[2]
        middle_point = (lt[0] + br[0]) / 2, (lt[1] + br[1]) / 2

        result.append(dict(
            result=middle_point,
            rectangle=pypts,
            confidence=(matches_mask.count(1), len(good)) #min(1.0 * matches_mask.count(1) / 10, 1.0)
        ))

        if maxcnt and len(result) >= maxcnt:
            break
        
        # 从特征点中删掉那些已经匹配过的, 用于寻找多个目标
        qindexes, tindexes = [], []
        for m in good:
            qindexes.append(m.queryIdx) # need to remove from kp_sch
            tindexes.append(m.trainIdx) # need to remove from kp_img

        def filter_index(indexes, arr):
            r = np.ndarray(0, np.float32)
            for i, item in enumerate(arr):
                if i not in qindexes:
                    r = np.append(r, item)
            return r
        kp_src = filter_index(tindexes, kp_src)
        des_src = filter_index(tindexes, des_src)

    return result

def find_all(im_source, im_search, maxcnt=0):
    '''
    优先Template，之后Sift
    @ return [(x,y), ...]
    '''
    result = find_all_template(im_source, im_search, maxcnt=maxcnt)
    if not result:
        result = find_all_sift(im_source, im_search, maxcnt=maxcnt)
    if not result:
        return []
    return [match["result"] for match in result]

def find(im_source, im_search):
    '''
    Only find maximum one object
    '''
    r = find_all(im_source, im_search, maxcnt=1)
    return r[0] if r else None

def brightness(im):
    '''
    Return the brightness of an image
    Args:
        im(numpy): image

    Returns:
        float, average brightness of an image
    '''
    im_hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(im_hsv) 
    height, weight = v.shape[:2]
    total_bright = 0
    for i in v:
        total_bright = total_bright+sum(i)
    return float(total_bright)/(height*weight)


def main():
    print(cv2.IMREAD_COLOR)
    print(cv2.IMREAD_GRAYSCALE)
    print(cv2.IMREAD_UNCHANGED)
    imsrc = imread('testdata/1s.png')
    imsch = imread('testdata/1t.png')
    print(brightness(imsrc))
    print(brightness(imsch))

    pt = find(imsrc, imsch)
    #mark_point(imsrc, pt)
    #show(imsrc)
    imsrc = imread('testdata/2s.png')
    imsch = imread('testdata/2t.png')
    result = find_all_template(imsrc, imsch)
    print(result)
    pts = []
    for match in result:
        pt = match["result"]
        #mark_point(imsrc, pt)
        pts.append(pt)
    # pts.sort()
    #show(imsrc)
    # print pts
    # print sorted(pts, key=lambda p: p[0])

    imsrc = imread('yl/bg_half.png')
    imsch = imread('yl/q_small.png')
    print(result)
    print('SIFT count=', sift_count(imsch))
    print(find_sift(imsrc, imsch))
    print(find_all_sift(imsrc, imsch))
    print(find_all_template(imsrc, imsch))
    print(find_all(imsrc, imsch))


if __name__ == '__main__':
    main()
```

---
### 2. **结合adb使用**
```python
"""ADB Auto Player Template Matching Module."""
 
from enum import StrEnum, auto
from pathlib import Path
from typing import NamedTuple
 
import cv2
import numpy as np
 
 
class MatchMode(StrEnum):
    """Match mode as a sting-based enum."""
 
    BEST = auto()
    TOP_LEFT = auto()
    TOP_RIGHT = auto()
    BOTTOM_LEFT = auto()
    BOTTOM_RIGHT = auto()
    LEFT_TOP = auto()
    LEFT_BOTTOM = auto()
    RIGHT_TOP = auto()
    RIGHT_BOTTOM = auto()
 
 
class CropRegions(NamedTuple):
    """Crop named tuple."""
 
    left: float = 0  # Percentage to crop from the left side
    right: float = 0  # Percentage to crop from the right side
    top: float = 0  # Percentage to crop from the top side
    bottom: float = 0  # Percentage to crop from the bottom side
 
 
template_cache: dict[str, np.ndarray] = {}
 
 
def load_image(
    image_path: Path,
    image_scale_factor: float = 1.0,
    grayscale: bool = False,
) -> np.ndarray:
    """Loads an image from disk or returns the cached version if available.
 
    Resizes the image if needed and stores it in the global template_cache.
 
    Args:
        image_path: Path to the template image.
        image_scale_factor: Scale factor for resizing the image.
        grayscale: Whether to convert the image to grayscale.
 
    Returns:
        np.ndarray
    """
    if image_path.suffix == "":
        image_path = image_path.with_suffix(".png")
 
    cache_key = f"{image_path}_{image_scale_factor}_grayscale={grayscale}"
    if cache_key in template_cache:
        return template_cache[cache_key]
 
    image = cv2.imdecode(np.fromfile(image_path, dtype=np.uint8), cv2.IMREAD_COLOR)
    if image is None:
        raise FileNotFoundError(f"Failed to load image from path: {image_path}")
 
    if image_scale_factor != 1.0:
        new_width = int(image.shape[1] * image_scale_factor)
        new_height = int(image.shape[0] * image_scale_factor)
        image = cv2.resize(
            image, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4
        )
 
    if grayscale:
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
 
    template_cache[cache_key] = image
    return image
 
 
def crop_image(image: np.ndarray, crop: CropRegions) -> tuple[np.ndarray, int, int]:
    """Crop an image based on percentage values for each side.
 
    Args:
        image (np.ndarray): The input image to be cropped.
        crop (Crop): The crop percentage values for each edge.
 
    Returns:
        Cropped image.
        Number of pixels cropped from the left.
        Number of pixels cropped from the top.
 
    Raises:
        ValueError: If any crop percentage is negative,
            the sum of left and right crop percentages is 1.0 or greater
            or the sum of top and bottom crop percentages is 1.0 or greater.
            :rtype: tuple[np.ndarray, int, int]
    """
    if all(v == 0 for v in (crop.left, crop.right, crop.top, crop.bottom)):
        return image, 0, 0
 
    if any(v < 0 for v in (crop.left, crop.right, crop.top, crop.bottom)):
        raise ValueError("Crop percentages cannot be negative.")
    if crop.left + crop.right >= 1.0:
        raise ValueError("left + right must be less than 1.0.")
    if crop.top + crop.bottom >= 1.0:
        raise ValueError("top + bottom must be less than 1.0.")
 
    height, width = image.shape[:2]
    left_px = int(width * crop.left)
    right_px = int(width * (1 - crop.right))
    top_px = int(height * crop.top)
    bottom_px = int(height * (1 - crop.bottom))
 
    cropped_image = image[top_px:bottom_px, left_px:right_px]
    return cropped_image, left_px, top_px
 
 
def similar_image(
    base_image: np.ndarray,
    template_image: np.ndarray,
    threshold: float = 0.9,
    grayscale: bool = False,
) -> bool:
    """
    判断两个图像是否相似。
    通过比较模板图像与基础图像之间的匹配程度来判断两者是否相似。使用OpenCV库进行图像处理和匹配。
 
    :param base_image: 基础图像，作为背景进行匹配。
    :param template_image: 模板图像，将在基础图像中寻找相似的模式。
    :param threshold: 匹配度阈值，默认为0.9。匹配结果中的最大值必须大于等于此值才能认为图像相似。
    :param grayscale: 是否将图像转换为灰度图像进行处理，默认为False。灰度处理可以提高匹配的鲁棒性。
    :return: 如果模板图像与基础图像的某部分匹配度达到或超过阈值，则返回True，否则返回False。
    """
    base_cv, template_cv = _prepare_images_for_processing(
        base_image=base_image,
        template_image=template_image,
        threshold=threshold,
        grayscale=grayscale,
    )
 
    result = cv2.matchTemplate(base_cv, template_cv, method=cv2.TM_CCOEFF_NORMED)
    return np.max(result) >= threshold
 
 
def find_template_match(
    base_image: np.ndarray,
    template_image: np.ndarray,
    match_mode: MatchMode = MatchMode.BEST,
    threshold: float = 0.9,
    grayscale: bool = False,
) -> tuple[int, int] | None:
    """
    在基础图像中寻找模板图像的匹配位置。
 
    :param base_image: 基础图像数组。
    :param template_image:  模板图像数组。
    :param match_mode: 匹配模式，默认为最佳匹配。
    :param threshold: 匹配阈值，默认为0.9。
    :param grayscale: 是否转换图像为灰度，默认为False。
    :return: 匹配位置的中心坐标，如果没有找到匹配则返回None。
    """
 
    base_cv, template_cv = _prepare_images_for_processing(
        base_image=base_image,
        template_image=template_image,
        threshold=threshold,
        grayscale=grayscale,
    )
 
    result = cv2.matchTemplate(base_cv, template_cv, cv2.TM_CCOEFF_NORMED)
    if match_mode == MatchMode.BEST:
        _, max_val, _, max_loc = cv2.minMaxLoc(result)
        if max_val >= threshold:
            template_height, template_width = template_cv.shape[:2]
            center_x = max_loc[0] + template_width // 2
            center_y = max_loc[1] + template_height // 2
            return center_x, center_y
        return None
 
    match_locations = np.where(result >= threshold)
    if len(match_locations[0]) == 0:
        return None
 
    template_height, template_width = template_cv.shape[:2]
    matches = list(zip(match_locations[1], match_locations[0]))  # x, y coordinates
 
    key_functions = {
        MatchMode.TOP_LEFT: lambda loc: (loc[1], loc[0]),
        MatchMode.TOP_RIGHT: lambda loc: (loc[1], -loc[0]),
        MatchMode.BOTTOM_LEFT: lambda loc: (-loc[1], loc[0]),
        MatchMode.BOTTOM_RIGHT: lambda loc: (-loc[1], -loc[0]),
        MatchMode.LEFT_TOP: lambda loc: (loc[0], loc[1]),
        MatchMode.LEFT_BOTTOM: lambda loc: (loc[0], -loc[1]),
        MatchMode.RIGHT_TOP: lambda loc: (-loc[0], loc[1]),
        MatchMode.RIGHT_BOTTOM: lambda loc: (-loc[0], -loc[1]),
    }
 
    selected_match = min(matches, key=key_functions[match_mode])
    center_x = selected_match[0] + template_width // 2
    center_y = selected_match[1] + template_height // 2
 
    return center_x, center_y
 
 
def find_all_template_matches(
    base_image: np.ndarray,
    template_image: np.ndarray,
    threshold: float = 0.9,
    grayscale: bool = False,
    min_distance: int = 10,
) -> list[tuple[int, int]]:
    """
    在基础图像中查找所有与模板图像匹配的位置。
 
    :param base_image: 基础图像数组。
    :param template_image: 模板图像数组。
    :param threshold: 匹配度阈值，默认为0.9。
    :param grayscale: 是否转换图像为灰度，默认为False。
    :param min_distance: 最小匹配间距，默认为10。
    :return: 匹配位置的中心坐标列表。
    """
 
    base_cv, template_cv = _prepare_images_for_processing(
        base_image=base_image,
        template_image=template_image,
        threshold=threshold,
        grayscale=grayscale,
    )
 
    result = cv2.matchTemplate(base_cv, template_cv, cv2.TM_CCOEFF_NORMED)
    match_locations = np.where(result >= threshold)
 
    template_height, template_width = template_cv.shape[:2]
    centers = []
 
    for x, y in zip(match_locations[1], match_locations[0]):
        center_x = x + template_width // 2
        center_y = y + template_height // 2
        centers.append((center_x, center_y))
 
    if centers:
        centers = _suppress_close_matches(centers, min_distance)
 
    return centers
 
 
def find_worst_template_match(
    base_image: np.ndarray,
    template_image: np.ndarray,
    grayscale: bool = False,
) -> tuple[int, int] | None:
    """
 
    :param base_image: 基础图像数组。
    :param template_image: 模板图像数组。
    :param grayscale: 是否转换图像为灰度，默认为False。
    :return:
    """
    base_cv, template_cv = _prepare_images_for_processing(
        base_image=base_image, template_image=template_image, grayscale=grayscale
    )
 
    diff_map = cv2.matchTemplate(base_cv, template_cv, cv2.TM_SQDIFF)
 
    _, max_val, _, max_diff_loc = cv2.minMaxLoc(diff_map)
    min_difference_threshold = 10000
    if max_val < min_difference_threshold:
        return None
    max_diff_x, max_diff_y = max_diff_loc
 
    template_height, template_width = template_cv.shape[:2]
    center_x = max_diff_x + template_width // 2
    center_y = max_diff_y + template_height // 2
 
    return center_x, center_y
 
 
def _suppress_close_matches(
    matches: list[tuple[int, int]], min_distance: int
) -> list[tuple[int, int]]:
    """Suppresses closely spaced matches to return distinct results.
 
    Uses a simple clustering method based on minimum distance.
    """
    if not matches:
        return []
 
    matches_array = np.array(matches)
    suppressed: list[tuple[int, int]] = []  # type: ignore
    dimension = 2
 
    for match in matches_array:
        match_tuple = tuple(match)
        if len(match_tuple) == dimension and all(
            np.linalg.norm(match_tuple - np.array(s)) >= min_distance
            for s in suppressed
        ):
            suppressed.append(match_tuple)  # type: ignore
    return suppressed
 
 
def _validate_threshold(threshold: float) -> None:
    """Validate the threshold value.
 
    Raises:
        ValueError: If the threshold is less than 0 or greater than 1.
    """
    if threshold < 0.0 or threshold > 1.0:
        raise ValueError(f"Threshold must be between 0 and 1, got {threshold}")
 
 
def _validate_template_size(base_image: np.ndarray, template_image: np.ndarray) -> None:
    """Validate that the template image is smaller than the base image.
 
    Args:
        base_image: The base Image as ndarray
        template_image: The template Image as ndarray
 
    Raises:
        ValueError: If the template is larger than the base image in any dimension
    """
    base_height, base_width = base_image.shape[:2]
    template_height, template_width = template_image.shape[:2]
 
    if template_height > base_height or template_width > base_width:
        cv2.imwrite("debug/validate_template_size_base_image.png", base_image)
        cv2.imwrite("debug/validate_template_size_template_image.png", template_image)
        raise ValueError(
            f"Template must be smaller than the base image. "
            f"Base size: ({base_width}, {base_height}), "
            f"Template size: ({template_width}, {template_height})"
        )
 
 
def _prepare_images_for_processing(
    base_image, template_image, threshold=None, grayscale=True
):
    """Validates inputs and prepares images for template matching.
 
    Args:
        base_image (np.ndarray): The base image.
        template_image (np.ndarray): The template image.
        threshold (float, optional): Matching threshold to validate.
        grayscale (bool): Whether to convert images to grayscale.
 
    Returns:
        Tuple[np.ndarray, np.ndarray]: Prepared base and template images.
    """
    if threshold is not None:
        _validate_threshold(threshold)
 
    _validate_template_size(base_image=base_image, template_image=template_image)
 
    if grayscale:
        return convert_to_grayscale(base_image), convert_to_grayscale(template_image)
 
    return base_image, template_image
 
 
_NUM_COLORS_IN_RGB = 3
 
 
def convert_to_grayscale(image: np.ndarray) -> np.ndarray:
    """Convert np.ndarray to grayscale."""
    if len(image.shape) == _NUM_COLORS_IN_RGB:
        return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return image
```
